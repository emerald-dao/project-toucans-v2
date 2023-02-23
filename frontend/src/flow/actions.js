import './config';
import * as fcl from '@onflow/fcl';
import { Buffer } from 'buffer';
import { browser } from '$app/environment';
import { addresses, user } from '$stores/flow/FlowStore';
import { executeTransaction, formatFix, replaceWithProperValues } from './utils';

import rawFinancialTokenCode from './cadence/ExampleFinancial.cdc?raw';
import rawCommunityTokenCode from './cadence/ExampleCommunity.cdc?raw';
import deployFinancialTokenTx from './cadence/transactions/financial/deploy_contract.cdc?raw';
import deployCommunityTokenTx from './cadence/transactions/community/deploy_contract.cdc?raw';
import fundProjectTx from './cadence/transactions/financial/fund_project.cdc?raw';
import newRoundTx from './cadence/transactions/financial/new_round.cdc?raw';
import transferTokensTx from './cadence/transactions/community/transfer_tokens.cdc?raw';
import getFinancialProjectScript from './cadence/scripts/financial/get_project.cdc?raw';
import getCommunityProjectScript from './cadence/scripts/community/get_project.cdc?raw';
import getFinancialTokenBalanceScript from './cadence/scripts/financial/get_token_balance.cdc?raw';
import { get } from 'svelte/store';
import { fundData } from '$stores/fund/FundDataStore';
import { roundData } from '$stores/rounds/RoundData';

const rawTokenCodes = {
	Financial: rawFinancialTokenCode,
	Community: rawCommunityTokenCode
};

if (browser) {
	// set Svelte $user store to currentUser,
	// so other components can access it
	fcl.currentUser.subscribe(user.set, []);
}

// Lifecycle FCL Auth functions
export const unauthenticate = () => fcl.unauthenticate();
export const logIn = async () => await fcl.logIn();
export const signUp = () => fcl.signUp();

// ****** Transactions ****** //
const dummyTransaction = async () => {
	return await fcl.mutate({
		cadence: `
    transaction {
      execute {
        log("Hello from execute")
      }
    }
  `,
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};
export const dummyTransactionExecution = () => executeTransaction(dummyTransaction);

const deployContract = async (data) => {
	console.log(data);
	const rawContractCode = rawTokenCodes[data.tokenomics.tokenType];
	let contractCode = rawContractCode
		.replace('INSERT NAME', data.daoDetails.name)
		.replace('INSERT DESCRIPTION', data.daoDetails.description)
		.replace('INSERT SYMBOL', data.daoDetails.tokenName)
		.replace('INSERT URL', data.daoDetails.website);
	const contractName = data.daoDetails.contractName;

	if (data.tokenomics.tokenType == 'Financial') {
		contractCode = contractCode.replace(
			'// INSERT MINTING HERE',
			data.tokenomics.mintTokens
				? `pub fun mintTokens(amount: UFix64): @Vault {
			pre {
			  amount > 0.0: "Amount minted must be greater than zero"
			}
			ExampleFinancial.totalSupply = ExampleFinancial.totalSupply + amount
			emit TokensMinted(amount: amount)
			return <- create Vault(balance: amount)
		}`
				: ''
		);
		const hexCode = Buffer.from(replaceWithProperValues(contractCode, contractName)).toString(
			'hex'
		);
		return deployFinancialContract(hexCode, contractName, data);
	} else if (data.tokenomics.tokenType == 'Community') {
		const hexCode = Buffer.from(replaceWithProperValues(contractCode, contractName)).toString(
			'hex'
		);
		return deployCommunityContract(hexCode, contractName, data);
	}
};

const deployFinancialContract = async (hexCode, contractName, data) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(deployFinancialTokenTx),
		args: (arg, t) => [
			arg(contractName, t.String),
			arg(formatFix(data.tokenomics.targetAmount), t.UFix64),
			arg(formatFix(data.tokenomics.initialRound.issuanceRate), t.UFix64),
			arg(formatFix(data.tokenomics.initialRound.reserveRate / 100.0), t.UFix64),
			arg([], t.Dictionary({ key: t.Address, value: t.UFix64 })),
			arg(formatFix(data.tokenomics.editDelay), t.UFix64),
			arg(hexCode, t.String),
			arg("FlowToken", t.String),
			arg(addresses.FlowToken, t.Address),
			arg({ domain: "public", identifier: "flowTokenReceiver" }, t.Path),
			arg({ domain: "public", identifier: "flowTokenBalance" }, t.Path),
			arg({ domain: "storage", identifier: "flowTokenVault" }, t.Path),

		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

const deployCommunityContract = async (hexCode, contractName, data) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(deployCommunityTokenTx),
		args: (arg, t) => [
			arg(contractName, t.String),
			arg(formatFix(data.tokenomics.totalSupply), t.UFix64),
			arg(hexCode, t.String)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const deployContractExecution = (data, action) =>
	executeTransaction(() => deployContract(data), action);

const fundProject = async () => {
	const contractName = get(fundData).contractName;
	const projectOwner = get(fundData).daoAddress;
	const projectId = get(fundData).projectId;
	const amount = get(fundData).amount;
	const message = get(fundData).specialMessage;
	return await fcl.mutate({
		cadence: replaceWithProperValues(fundProjectTx, contractName, projectOwner),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.UInt64),
			arg(formatFix(amount), t.UFix64),
			arg(message, t.String)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const fundProjectExecution = () => executeTransaction(fundProject);

const newRound = async () => {
	const newRoundData = get(roundData);
	console.log(newRoundData)
	const fundingGoal = newRoundData.infiniteFundingGoal ? null : formatFix(newRoundData.fundingGoal);
	const startTime = formatFix(Math.floor(new Date(newRoundData.startDate).getTime() / 1000));
	const endTime = newRoundData.infiniteDuration ? null : formatFix(Math.floor(new Date(newRoundData.endDate).getTime() / 1000));
	const [, ...distributionAddresses] = newRoundData.distributionList.map((x) => x[0]);
	const [, ...distributionPercentages] = newRoundData.distributionList.map((x) => formatFix(x[1] / 100));
	return await fcl.mutate({
		cadence: replaceWithProperValues(newRoundTx),
		args: (arg, t) => [
			arg(newRoundData.projectId, t.UInt64),
			arg(fundingGoal, t.Optional(t.UFix64)),
			arg(formatFix(newRoundData.issuanceRate), t.UFix64),
			arg(formatFix(newRoundData.reserveRate / 100.0), t.UFix64),
			arg(startTime, t.UFix64),
			arg(endTime, t.Optional(t.UFix64)),
			arg(distributionAddresses, t.Array(t.Address)),
			arg(distributionPercentages, t.Array(t.UFix64)),
			arg([], t.Dictionary({ key: t.String, value: t.String }))
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const newRoundExecution = () => executeTransaction(newRound);

// const tranferTokens = async () => {
// 	const amount = "10.0";
// 	const recipient = "0x179b6b1cb6755e31"
// 	const contractAddress = "";
// 	const contractName = "";
// 	return await fcl.mutate({
// 		cadence: replaceWithProperValues(transferTokensTx, contractName, projectOwner),
// 		args: (arg, t) => [
// 			arg(amount, t.UFix64),
// 			arg(recipient, t.Address)
// 		],
// 		proposer: fcl.authz,
// 		payer: fcl.authz,
// 		authorizations: [fcl.authz],
// 		limit: 9999
// 	});
// }

// export const fundProjectExecution = () => executeTransaction(fundProject);

export const getProjectInfo = async (contractName, contractAddress, owner, type, projectId) => {
	const scriptCode = type === 'Financial' ? getFinancialProjectScript : getCommunityProjectScript;

	let args;
	if (type === 'Financial') {
		args = (arg, t) => [arg(owner, t.Address), arg(projectId, t.UInt64)];
	} else if (type === 'Community') {
		args = (arg, t) => [arg(owner, t.Address)];
	}
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(scriptCode, contractName, contractAddress),
			args
		});
		return response;
	} catch (e) {
		console.log('Error in getProjectInfo')
		console.log(e);
	}
};

export const getFinancialTokenBalance = async (contractName, contractAddress, user) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getFinancialTokenBalanceScript, contractName, contractAddress),
			args: (arg, t) => [
				arg(user, t.Address)
			]
		})
		return response;
	} catch (e) {
		console.log('Error in getFinancialTokenBalance')
		console.log(e);
		return '0.0';
	}
}