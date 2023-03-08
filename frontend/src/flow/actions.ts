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
import acceptActionTx from './cadence/transactions/accept_action.cdc?raw';
import declineActionTx from './cadence/transactions/decline_action.cdc?raw';

// Treasury Actions
import proposePaymentTokenWithdrawTx from './cadence/transactions/treasury-actions/propose_payment_token_withdraw.cdc?raw';
import proposeFUSDWithdrawTx from './cadence/transactions/treasury-actions/propose_fusd_withdraw.cdc?raw';
import proposeFlowTokenWithdrawTx from './cadence/transactions/treasury-actions/propose_flow_token_withdraw.cdc?raw';

// Scripts
import getProjectScript from './cadence/scripts/get_project.cdc?raw';
import getTokenBalanceScript from './cadence/scripts/get_token_balance.cdc?raw';
import getPendingActionsInDAOScript from './cadence/scripts/get_pending_actions_in_dao.cdc?raw';

import { get } from 'svelte/store';
import { fundingData } from '$lib/features/funding/stores/FundingData';
import { currencies } from '$stores/flow/TokenStore';
import { roundGeneratorData } from '../lib/features/round-generator/stores/RoundGeneratorData';
import type { DaoBlockchainData } from '$lib/types/dao-project/dao-project.interface';

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
	const hexCode = Buffer.from(replaceWithProperValues(contractCode, contractName)).toString('hex');
	return await fcl.mutate({
		cadence: replaceWithProperValues(deployExampleTokenTx),
		args: (arg, t) => [
			arg(contractName, t.String),
			arg(formatFix(data.tokenomics.editDelay), t.UFix64),
			arg(hexCode, t.String),
			arg(paymentCurrencyInfo.contractName, t.String),
			arg(addresses.FlowToken, t.Address),
			arg({ domain: 'public', identifier: paymentCurrencyInfo.receiverPath }, t.Path),
			arg({ domain: 'public', identifier: paymentCurrencyInfo.publicPath }, t.Path),
			arg({ domain: 'storage', identifier: paymentCurrencyInfo.storagePath }, t.Path),
			arg([], t.Array(t.Address)),
			arg(data.tokenomics.mintTokens, t.Bool)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const deployContractExecution = (data, actionAfterSucceed) =>
	executeTransaction(() => deployContract(data), actionAfterSucceed);

const fundProject = async () => {
	const projectOwner = get(fundingData).daoAddress;
	const projectId = get(fundingData).projectId;
	const amount = get(fundingData).amount;
	const message = get(fundingData).specialMessage;
	return await fcl.mutate({
		cadence: replaceWithProperValues(fundProjectTx, projectId, projectOwner),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.String),
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
	const newRoundData = get(roundGeneratorData);
	console.log(newRoundData);
	const fundingGoal = newRoundData.infiniteFundingGoal ? null : formatFix(newRoundData.fundingGoal);
	console.log(new Date(newRoundData.startDate));
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
			arg(newRoundData.projectId, t.String),
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
const proposeWithdraw = async (
	projectOwner: string,
	projectId: string,
	recipient: string,
	amount: string
) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(proposePaymentTokenWithdrawTx),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.String),
			arg(recipient, t.Address),
			arg(amount, t.UFix64)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const proposeWithdrawExecution = (
	projectOwner: string,
	projectId: string,
	recipient: string,
	amount: string
) => executeTransaction(() => proposeWithdraw(projectOwner, projectId, recipient, amount));

const signAction = async (actionMessage: string, actionUUID: number) => {
	const intent = actionMessage;
	const latestBlock = await fcl.block(true);
	const intentHex = Buffer.from(`${intent}`).toString('hex');
	const MSG = `${actionUUID}${intentHex}${latestBlock.id}`;
	const sig = await fcl.currentUser().signUserMessage(MSG);
	const keyIds = sig.map((s) => {
		return s.keyId;
	});
	const signatures = sig.map((s) => {
		return s.signature.signature;
	});

	return { keyIds, signatures, MSG, signatureBlock: latestBlock };
};

const acceptAction = async (
	projectOwner: string,
	projectId: string,
	actionMessage: string,
	actionUUID: number
) => {
	const { keyIds, signatures, MSG, signatureBlock } = signAction(actionMessage, actionUUID);

	return await fcl.mutate({
		cadence: replaceWithProperValues(acceptActionTx),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.String),
			arg(actionUUID, t.UInt64),
			arg(MSG, t.String),
			arg(keyIds, t.Array(t.Int)),
			arg(signatures, t.Array(t.String)),
			arg(signatureBlock, t.UInt64)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const acceptActionExecution = (
	projectOwner: string,
	projectId: string,
	actionMessage: string,
	actionUUID: number
) => executeTransaction(() => acceptAction(projectOwner, projectId, actionMessage, actionUUID));

const declineAction = async (
	projectOwner: string,
	projectId: string,
	actionMessage: string,
	actionUUID: number
) => {
	const { keyIds, signatures, MSG, signatureBlock } = signAction(actionMessage, actionUUID);

	return await fcl.mutate({
		cadence: replaceWithProperValues(declineActionTx),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.String),
			arg(actionUUID, t.UInt64),
			arg(MSG, t.String),
			arg(keyIds, t.Array(t.Int)),
			arg(signatures, t.Array(t.String)),
			arg(signatureBlock, t.UInt64)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const declineActionExecution = (
	projectOwner: string,
	projectId: string,
	actionMessage: string,
	actionUUID: number
) => executeTransaction(() => declineAction(projectOwner, projectId, actionMessage, actionUUID));

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

export const getProjectInfo: (
	contractAddress: string,
	owner: string,
	projectId: string
) => Promise<DaoBlockchainData> = async (contractAddress, owner, projectId) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getProjectScript, projectId, contractAddress),
			args: (arg, t) => [arg(owner, t.Address), arg(projectId, t.String)]
		});
		return response;
	} catch (e) {
		console.log('Error in getProjectInfo');
		console.log(e);
	}
};

export const getTokenBalance = async (projectId: string, contractAddress: string, user: string) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getTokenBalanceScript, projectId, contractAddress),
			args: (arg, t) => [arg(user, t.Address)]
		});
		return response;
	} catch (e) {
		console.log('Error in getTokenBalance');
		console.log(e);
		return '0.0';
	}
};

export const getPendingActionInDAO = async (owner: string, projectId: string) => {
	console.log(projectId);
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getPendingActionsInDAOScript),
			args: (arg, t) => [arg(owner, t.Address), arg(projectId, t.String)]
		});
		return response;
	} catch (e) {
		console.log('Error in getPendingActionInDAO');
		console.log(e);
	}
};
