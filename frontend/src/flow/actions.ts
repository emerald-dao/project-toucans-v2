import './config';
import * as fcl from '@onflow/fcl';
import { Buffer } from 'buffer';
import { browser } from '$app/environment';
import { addresses, user } from '$stores/flow/FlowStore';
import { executeTransaction, formatFix, replaceWithProperValues } from './utils';

// Transactions
import rawExampleTokenCode from './cadence/ExampleToken.cdc?raw';
import deployExampleTokenTx from './cadence/transactions/deploy_contract.cdc?raw';
import fundProjectTx from './cadence/transactions/fund_project.cdc?raw';
import newRoundTx from './cadence/transactions/new_round.cdc?raw';

// Treasury Actions
import proposePaymentTokenWithdrawTx from './cadence/transactions/treasury-actions/propose_payment_token_withdraw.cdc?raw';
import proposeFUSDWithdrawTx from './cadence/transactions/treasury-actions/propose_fusd_withdraw.cdc?raw';
import proposeFlowTokenWithdrawTx from './cadence/transactions/treasury-actions/propose_flow_token_withdraw.cdc?raw';

// Scripts
import getProjectScript from './cadence/scripts/get_project.cdc?raw';
import getTokenBalanceScript from './cadence/scripts/get_token_balance.cdc?raw';

import { get } from 'svelte/store';
import { fundData } from '$stores/fund/FundDataStore';
import { currencies } from '$stores/flow/TokenStore';
import { roundData } from '$components/round-generator/stores/RoundData';

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
	let contractCode = rawExampleTokenCode
		.replace('INSERT NAME', data.daoDetails.name)
		.replace('INSERT DESCRIPTION', data.daoDetails.description)
		.replace('INSERT SYMBOL', data.daoDetails.tokenName)
		.replace('INSERT URL', data.daoDetails.website);
	const contractName = data.daoDetails.contractName;
	const paymentCurrency = data.tokenomics.paymentCurrency;
	const paymentCurrencyInfo = currencies[paymentCurrency];

	contractCode = contractCode.replace(
		'// INSERT MINTING HERE',
		data.tokenomics.mintTokens
			? `self.account.save(<- create Minter(), to: self.MinterStoragePath)`
			: ''
	);
	const hexCode = Buffer.from(replaceWithProperValues(contractCode, contractName)).toString(
		'hex'
	);
	return await fcl.mutate({
		cadence: replaceWithProperValues(deployExampleTokenTx),
		args: (arg, t) => [
			arg(contractName, t.String),
			arg(formatFix(data.tokenomics.editDelay), t.UFix64),
			arg(hexCode, t.String),
			arg(paymentCurrencyInfo.contractName, t.String),
			arg(addresses.FlowToken, t.Address),
			arg({ domain: "public", identifier: paymentCurrencyInfo.receiverPath }, t.Path),
			arg({ domain: "public", identifier: paymentCurrencyInfo.publicPath }, t.Path),
			arg({ domain: "storage", identifier: paymentCurrencyInfo.storagePath }, t.Path),
			arg([], t.Array(t.Address)),
			arg('0', t.UInt64),
			arg(data.tokenomics.mintTokens, t.Bool)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const deployContractExecution = (data, action) => executeTransaction(() => deployContract(data), action);

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
	console.log(newRoundData);
	const fundingGoal = newRoundData.infiniteFundingGoal ? null : formatFix(newRoundData.fundingGoal);
	const startTime = formatFix(Math.floor(new Date(newRoundData.startDate).getTime() / 1000));
	const endTime = newRoundData.infiniteDuration
		? null
		: formatFix(Math.floor(new Date(newRoundData.endDate).getTime() / 1000));
	const [, ...distributionAddresses] = newRoundData.distributionList.map((x) => x[0]);
	const [, ...distributionPercentages] = newRoundData.distributionList.map((x) =>
		formatFix(x[1] / 100)
	);
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
			arg(distributionPercentages, t.Array(t.UFix64))
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const newRoundExecution = () => executeTransaction(newRound);

// TODO: IMPLEMENT FOR FLOW TOKEN AND FUSD
const proposeWithdraw = async (projectOwner: string, projectId: string, recipient: string, amount: string) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(proposePaymentTokenWithdrawTx),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.UInt64),
			arg(recipient, t.Address),
			arg(amount, t.UFix64)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const proposeWithdrawExecution = (projectOwner: string, projectId: string, recipient: string, amount: string) =>
	executeTransaction(() => proposeWithdraw(projectOwner, projectId, recipient, amount));

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

export const getProjectInfo = async (contractName: string, contractAddress: string, owner: string, projectId: string) => {
	console.log(projectId)
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getProjectScript, contractName, contractAddress),
			args: (arg, t) => [arg(owner, t.Address), arg(projectId, t.UInt64)]
		});
		return response;
	} catch (e) {
		console.log('Error in getProjectInfo');
		console.log(e);
	}
};

export const getTokenBalance = async (contractName: string, contractAddress: string, user: string) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getTokenBalanceScript, contractName, contractAddress),
			args: (arg, t) => [
				arg(user, t.Address)
			]
		})
		return response;
	} catch (e) {
		console.log('Error in getTokenBalance');
		console.log(e);
		return '0.0';
	}
};
