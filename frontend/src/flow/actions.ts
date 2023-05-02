import './config';
import * as fcl from '@onflow/fcl';
import { Buffer } from 'buffer';
import { browser } from '$app/environment';
import { addresses, user } from '$stores/flow/FlowStore';
import { executeTransaction, formatFix, replaceWithProperValues, splitList } from './utils';

// Transactions
import rawExampleTokenCode from './cadence/ExampleToken.cdc?raw';
import deployExampleTokenTx from './cadence/transactions/deploy_contract.cdc?raw';
import fundProjectTx from './cadence/transactions/fund_project.cdc?raw';
import donateTx from './cadence/transactions/donate.cdc?raw';
import newRoundTx from './cadence/transactions/new_round.cdc?raw';
import acceptActionTx from './cadence/transactions/accept_action.cdc?raw';
import declineActionTx from './cadence/transactions/decline_action.cdc?raw';
import claimOverflowTx from './cadence/transactions/claim_overflow.cdc?raw';
import transferOverflowTx from './cadence/transactions/transfer_overflow.cdc?raw';

// Treasury Actions
import withdrawTokensTx from './cadence/transactions/treasury-actions/withdraw_tokens.cdc?raw';
import updateMultiSigTx from './cadence/transactions/treasury-actions/update_multisig.cdc?raw';
import mintTokensTx from './cadence/transactions/treasury-actions/mint_tokens.cdc?raw';
import mintTokensToTreasuryTx from './cadence/transactions/treasury-actions/mint_tokens_to_treasury.cdc?raw';
import togglePurchasingTx from './cadence/transactions/toggle_purchasing.cdc?raw';

// Scripts
import getProjectScript from './cadence/scripts/get_project.cdc?raw';
import getTokenBalanceScript from './cadence/scripts/get_token_balance.cdc?raw';
import getPendingActionsScript from './cadence/scripts/get_pending_actions.cdc?raw';
import getBalancesScript from './cadence/scripts/get_balances.cdc?raw';
import hasVaultSetupScript from './cadence/scripts/has_vault_setup.cdc?raw';
// NFTCatalog
import getCatalogKeysScript from './cadence/scripts/get_catalog_keys.cdc?raw';
import getCatalogListScript from './cadence/scripts/get_catalog_list.cdc?raw';
import ownsNFTFromCatalogScript from './cadence/scripts/owns_nft_from_catalog.cdc?raw';

import { get } from 'svelte/store';
import { currencies } from '$stores/flow/TokenStore';
import { roundGeneratorData } from '../lib/features/round-generator/stores/RoundGeneratorData';
import type { DaoBlockchainData } from '$lib/types/dao-project/dao-project.interface';
import { ECurrencies } from '$lib/types/common/enums';
import type { DaoGeneratorData } from '$lib/features/dao-generator/types/dao-generator-data.interface';
import type { TransactionStatusObject } from '@onflow/fcl';
import type { ActionExecutionResult } from '$stores/custom/steps/step.interface';

if (browser) {
	// set Svelte $user store to currentUser,
	// so other components can access it
	fcl.currentUser.subscribe(user.set, []);
}

// Lifecycle FCL Auth functions
export const unauthenticate = () => fcl.unauthenticate();
export const logIn = async () => fcl.logIn();
export const signUp = () => fcl.signUp();

//   _______                             _   _
//  |__   __|                           | | (_)
//     | |_ __ __ _ _ __  ___  __ _  ___| |_ _  ___  _ __  ___
//     | | '__/ _` | '_ \/ __|/ _` |/ __| __| |/ _ \| '_ \/ __|
//     | | | | (_| | | | \__ \ (_| | (__| |_| | (_) | | | \__ \
//     |_|_|  \__,_|_| |_|___/\__,_|\___|\__|_|\___/|_| |_|___/

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

const deployContract = async (data: DaoGeneratorData) => {
	console.log(data);
	let contractCode = rawExampleTokenCode
		.replaceAll('INSERT NAME', data.daoDetails.name)
		.replaceAll('INSERT DESCRIPTION', data.daoDetails.description)
		.replaceAll('INSERT SYMBOL', data.daoDetails.tokenName)
		.replaceAll('INSERT URL', data.daoDetails.website);
	const contractName = data.daoDetails.contractName;
	const paymentCurrency = data.tokenomics.paymentCurrency;
	const paymentCurrencyInfo = currencies[paymentCurrency];

	const hexCode = Buffer.from(replaceWithProperValues(contractCode, contractName)).toString('hex');
	return await fcl.mutate({
		cadence: replaceWithProperValues(deployExampleTokenTx),
		args: (arg, t) => [
			arg(contractName, t.String),
			arg(formatFix(data.tokenomics.editDelay), t.UFix64),
			arg(hexCode, t.String),
			arg(paymentCurrencyInfo.contractName, t.String),
			arg(addresses[paymentCurrencyInfo.contractName], t.Address),
			arg(paymentCurrencyInfo.symbol, t.String),
			arg({ domain: 'public', identifier: paymentCurrencyInfo.receiverPath }, t.Path),
			arg({ domain: 'public', identifier: paymentCurrencyInfo.publicPath }, t.Path),
			arg({ domain: 'storage', identifier: paymentCurrencyInfo.storagePath }, t.Path),
			arg(data.tokenomics.mintTokens, t.Bool),
			arg(formatFix(data.tokenomics.initialSupply), t.UFix64),
			arg(
				data.tokenomics.hasMaxSupply ? formatFix(data.tokenomics.maxSupply) : null,
				t.Optional(t.UFix64)
			)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const deployContractExecution = (
	data: DaoGeneratorData,
	actionAfterSucceed: (res: TransactionStatusObject) => Promise<ActionExecutionResult>
) => executeTransaction(() => deployContract(data), actionAfterSucceed);

const fundProject = async (
	projectOwner: string,
	projectId: string,
	amount: string,
	message: string,
	currency: ECurrencies,
	expectedAmount: string
) => {
	let txCode = fundProjectTx;
	if (currency === ECurrencies.USDC) {
		txCode = txCode.replaceAll('flowTokenVault', 'USDCVault').replaceAll('FlowToken', 'FiatToken');
	}
	return await fcl.mutate({
		cadence: replaceWithProperValues(txCode, projectId, projectOwner),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.String),
			arg(formatFix(amount), t.UFix64),
			arg(message, t.String),
			arg(formatFix(expectedAmount), t.UFix64)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const fundProjectExecution = (
	projectOwner: string,
	projectId: string,
	amount: string,
	message: string,
	currency: ECurrencies,
	expectedAmount: string
) =>
	executeTransaction(() =>
		fundProject(projectOwner, projectId, amount, message, currency, expectedAmount)
	);

const claimOverflow = async (
	projectOwner: string,
	projectId: string,
	amount: string,
	currency: ECurrencies
) => {
	let txCode = claimOverflowTx;
	if (currency === ECurrencies.USDC) {
		txCode = txCode
			.replaceAll('flowTokenReceiver', 'USDCVaultReceiver')
			.replaceAll('FlowToken', 'FiatToken');
	}
	return await fcl.mutate({
		cadence: replaceWithProperValues(txCode, projectId, projectOwner),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.String),
			arg(formatFix(amount), t.UFix64)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const claimOverflowExecution = (
	projectOwner: string,
	projectId: string,
	amount: string,
	currency: ECurrencies
) => executeTransaction(() => claimOverflow(projectOwner, projectId, amount, currency));

const transferOverflow = async (projectOwner: string, projectId: string, amount: string) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(transferOverflowTx),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.String),
			arg(formatFix(amount), t.UFix64)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const transferOverflowExecution = (
	projectOwner: string,
	projectId: string,
	amount: string
) => executeTransaction(() => transferOverflow(projectOwner, projectId, amount));

const donate = async (
	projectOwner: string,
	projectId: string,
	amount: string,
	message: string,
	currency: ECurrencies
) => {
	let txCode = donateTx;
	if (currency === ECurrencies.USDC) {
		txCode = txCode.replaceAll('flowTokenVault', 'USDCVault').replaceAll('FlowToken', 'FiatToken');
	}
	return await fcl.mutate({
		cadence: replaceWithProperValues(txCode, projectId, projectOwner),
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

export const donateExecution = (
	projectOwner: string,
	projectId: string,
	amount: string,
	message: string,
	currency: ECurrencies
) => executeTransaction(() => donate(projectOwner, projectId, amount, message, currency));

const newRound = async () => {
	const newRoundData = get(roundGeneratorData);
	const fundingGoal = newRoundData.infiniteFundingGoal ? null : formatFix(newRoundData.fundingGoal);
	const startTime = formatFix(newRoundData.startDate);
	const endTime = newRoundData.infiniteDuration ? null : formatFix(newRoundData.endDate);
	const [, , ...distributionAddresses] = newRoundData.distributionList.map((x) => x[0]);
	const [, , ...distributionPercentages] = newRoundData.distributionList.map((x) =>
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
			arg(distributionPercentages, t.Array(t.UFix64)),
			arg(fundingGoal ? newRoundData.allowOverflow : true, t.Bool),
			arg(null, t.Optional(t.Array(t.Address))),
			arg(newRoundData.requiredNft, t.Optional(t.String))
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const newRoundExecution = () => executeTransaction(newRound);

const togglePurchasing = async (projectId: string) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(togglePurchasingTx),
		args: (arg, t) => [arg(projectId, t.String)],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const togglePurchasingExecution = (projectId: string) =>
	executeTransaction(() => togglePurchasing(projectId));

const proposeWithdraw = async (
	tokenSymbol: string,
	recipient: string,
	amount: string,
	projectOwner: string,
	projectId: string
) => {
	console.log(amount);
	return await fcl.mutate({
		cadence: replaceWithProperValues(withdrawTokensTx),
		args: (arg, t) => [
			arg(tokenSymbol, t.String),
			arg(recipient, t.Address),
			arg(formatFix(amount), t.UFix64),
			arg(projectOwner, t.Address),
			arg(projectId, t.String)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const proposeWithdrawExecution = (
	tokenSymbol: string,
	recipient: string,
	amount: string,
	projectOwner: string,
	projectId: string
) =>
	executeTransaction(() =>
		proposeWithdraw(tokenSymbol, recipient, amount, projectOwner, projectId)
	);

const updateMultisig = async (
	projectOwner: string,
	projectId: string,
	newSigners: string[],
	newThreshold: number
) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(updateMultiSigTx),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.String),
			arg(newSigners, t.Array(t.Address)),
			arg(newThreshold, t.UInt64)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const updateMultisigExecution = (
	projectOwner: string,
	projectId: string,
	newSigners: string[],
	newThreshold: number
) => executeTransaction(() => updateMultisig(projectOwner, projectId, newSigners, newThreshold));

const signAction = async (actionMessage: string, actionUUID: string) => {
	const intent = actionMessage;
	const latestBlock = await fcl.block(true);
	const intentHex = Buffer.from(`${intent}`).toString('hex');
	const MSG = `${actionUUID}${intentHex}${latestBlock.id}`;
	console.log(MSG);
	const sig = await fcl.currentUser().signUserMessage(MSG);
	const keyIds = sig.map((s) => {
		return s.keyId;
	});
	const signatures = sig.map((s) => {
		return s.signature;
	});
	console.log(keyIds);
	console.log(signatures);

	return { keyIds, signatures, MSG, signatureBlock: latestBlock.height };
};

const acceptAction = async (
	projectOwner: string,
	projectId: string,
	actionMessage: string,
	actionUUID: string
) => {
	const { keyIds, signatures, MSG, signatureBlock } = await signAction(actionMessage, actionUUID);

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
	actionUUID: string
) => executeTransaction(() => acceptAction(projectOwner, projectId, actionMessage, actionUUID));

const declineAction = async (
	projectOwner: string,
	projectId: string,
	actionMessage: string,
	actionUUID: string
) => {
	const { keyIds, signatures, MSG, signatureBlock } = await signAction(actionMessage, actionUUID);

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
	actionUUID: string
) => executeTransaction(() => declineAction(projectOwner, projectId, actionMessage, actionUUID));

const mintTokens = async (
	projectOwner: string,
	projectId: string,
	recipient: string,
	amount: string
) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(mintTokensTx, projectId, projectOwner),
		args: (arg, t) => [
			arg(projectId, t.String),
			arg(formatFix(amount), t.UFix64),
			arg(recipient, t.Address)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const mintTokensExecution = (
	projectOwner: string,
	projectId: string,
	recipient: string,
	amount: string
) => executeTransaction(() => mintTokens(projectOwner, projectId, recipient, amount));

const mintTokensToTreasury = async (projectId: string, amount: string) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(mintTokensToTreasuryTx),
		args: (arg, t) => [arg(projectId, t.String), arg(formatFix(amount), t.UFix64)],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const mintTokensToTreasuryExecution = (projectId: string, amount: string) =>
	executeTransaction(() => mintTokensToTreasury(projectId, amount));

//    _____           _       _
//   / ____|         (_)     | |
//  | (___   ___ _ __ _ _ __ | |_ ___
//   \___ \ / __| '__| | '_ \| __/ __|
//   ____) | (__| |  | | |_) | |_\__ \
//  |_____/ \___|_|  |_| .__/ \__|___/
//                     | |
//                     |_|

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

export const getPendingActions = async (
	userAddress: string,
	projectOwners: string[],
	projectIds: string[]
) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getPendingActionsScript),
			args: (arg, t) => [
				arg(userAddress, t.Address),
				arg(projectOwners, t.Array(t.Address)),
				arg(projectIds, t.Array(t.String))
			]
		});
		return response;
	} catch (e) {
		console.log('Error in getPendingActions');
		console.log(e);
	}
};

export const getBalances = async (userAddress: string) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getBalancesScript),
			args: (arg, t) => [arg(userAddress, t.Address)]
		});
		return response;
	} catch (e) {
		console.log('Error in getBalances');
		console.log(e);
	}
};

export const hasVaultSetup = async (
	projectOwner: string,
	projectId: string,
	userAddress: string
) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(hasVaultSetupScript, projectId, projectOwner),
			args: (arg, t) => [arg(userAddress, t.Address)]
		});
		console.log(response);
		return response;
	} catch (e) {
		console.log('Error in hasVaultSetup');
		console.log(e);
	}
};

const getCatalogByCollectionIDs = async (group: string[]) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getCatalogListScript),
			args: (arg, t) => [arg(group, t.Array(t.String))]
		});

		return response;
	} catch (e) {
		console.log('Error in getCatalogByCollectionIDs');
		console.log(e);
	}
};

export const getNFTCatalog: () => Promise<{
	[key: string]: {
		identifier: string;
		name: string;
		image: string;
	};
}> = async () => {
	try {
		const catalogKeys = await fcl.query({
			cadence: replaceWithProperValues(getCatalogKeysScript),
			args: (arg, t) => []
		});
		const groups = splitList(catalogKeys, 50);
		const promises = groups.map((group) => {
			return getCatalogByCollectionIDs(group);
		});
		const itemGroups = await Promise.all(promises);

		const items = itemGroups.reduce((acc, current) => {
			return Object.assign(acc, current);
		}, {});

		return items;
	} catch (e) {
		console.log('Error in getNFTCatalog', e);
		throw new Error('Error in getNFTCatalog');
	}
};

export const ownsNFTFromCatalog = async (userAddress: string, collectionIdentifier: string) => {
	try {
		return await fcl.query({
			cadence: replaceWithProperValues(ownsNFTFromCatalogScript),
			args: (arg, t) => [
				arg(userAddress, t.Address),
				arg(collectionIdentifier, t.String)
			]
		});
	} catch (e) {
		console.log('Error in ownsNFTFromCatalog', e);
		throw new Error('Error in ownsNFTFromCatalog');
	}
};