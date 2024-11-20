import './config';
import * as fcl from '@onflow/fcl';
import { Buffer } from 'buffer';
import { browser } from '$app/environment';
import { addresses, user } from '$stores/flow/FlowStore';
import {
	executeTransaction,
	formatFix,
	replaceWithProperValues,
	splitList,
	switchToToken
} from './utils';

// Transactions
import rawExampleTokenCode from './cadence/ExampleToken.cdc?raw';
import deployExampleTokenTx from './cadence/transactions/deploy_contract.cdc?raw';
import deployDAOTx from './cadence/transactions/deploy_dao.cdc?raw';
import fundProjectTx from './cadence/transactions/fund_project.cdc?raw';
import donateTx from './cadence/transactions/donate.cdc?raw';
import donateNFTsTx from './cadence/transactions/donate_nfts.cdc?raw';
import transferProjectTokenToTreasuryTx from './cadence/transactions/transfer_project_token_to_treasury.cdc?raw';
import newRoundTx from './cadence/transactions/new_round.cdc?raw';
import editRoundTx from './cadence/transactions/edit_round.cdc?raw';
import voteOnActionTx from './cadence/transactions/vote_on_action.cdc?raw';
import claimOverflowTx from './cadence/transactions/claim_overflow.cdc?raw';
import claimLockedTokensTx from './cadence/transactions/claim_locked_tokens.cdc?raw';
import transferOverflowTx from './cadence/transactions/transfer_overflow.cdc?raw';
import setUpVaultTx from './cadence/transactions/set_up_vault.cdc?raw';
import addAllowedNFTCollectionsTx from './cadence/transactions/add_allowed_nft_collections.cdc?raw';
import removeAllowedNFTCollectionsTx from './cadence/transactions/remove_allowed_nft_collections.cdc?raw';
import togglePurchasingTx from './cadence/transactions/toggle_purchasing.cdc?raw';
import transferTokenTx from './cadence/transactions/transfer_token.cdc?raw';
import transferProjectTokenTx from './cadence/transactions/transfer_project_token.cdc?raw';

// Treasury Actions
import withdrawTokensTx from './cadence/transactions/treasury-actions/withdraw_tokens.cdc?raw';
import batchWithdrawTokensTx from './cadence/transactions/treasury-actions/batch_withdraw_tokens.cdc?raw';
import withdrawNFTsTx from './cadence/transactions/treasury-actions/withdraw_nfts.cdc?raw';
import updateMultiSigTx from './cadence/transactions/treasury-actions/update_multisig.cdc?raw';
import mintTokensTx from './cadence/transactions/treasury-actions/mint_tokens.cdc?raw';
import batchMintTokensTx from './cadence/transactions/treasury-actions/batch_mint_tokens.cdc?raw';
import burnTokensTx from './cadence/transactions/treasury-actions/burn_tokens.cdc?raw';
import lockTokensTx from './cadence/transactions/treasury-actions/lock_tokens.cdc?raw';
import mintTokensToTreasuryTx from './cadence/transactions/treasury-actions/mint_tokens_to_treasury.cdc?raw';
import stakeFlowTx from './cadence/transactions/treasury-actions/stake_flow.cdc?raw';
import unstakeFlowTx from './cadence/transactions/treasury-actions/unstake_flow.cdc?raw';

// Scripts
import getProjectScript from './cadence/scripts/get_project.cdc?raw';
import getProjectNoTokenScript from './cadence/scripts/get_project_no_token.cdc?raw';
import getProjectActionsScript from './cadence/scripts/get_project_actions.cdc?raw';
import getProjectLockedTokensScript from './cadence/scripts/get_project_locked_tokens.cdc?raw';
import getProjectNFTTreasuryScript from './cadence/scripts/get_project_nft_treasury.cdc?raw';
import getProjectNFTTreasuryIDsScript from './cadence/scripts/get_project_nft_treasury_ids.cdc?raw';
import getProjectSpecificNFTTreasuryScript from './cadence/scripts/get_project_specific_nft_treasury.cdc?raw';
import getProjectSpecificNFTTreasuryIDsScript from './cadence/scripts/get_project_specific_nft_treasury_ids.cdc?raw';
import getProjectLockedTokensForUserScript from './cadence/scripts/get_project_locked_tokens_for_user.cdc?raw';
import getTokenBalanceScript from './cadence/scripts/get_token_balance.cdc?raw';
import getPendingActionsScript from './cadence/scripts/get_pending_actions.cdc?raw';
import getBalancesScript from './cadence/scripts/get_balances.cdc?raw';
import hasProjectVaultSetupScript from './cadence/scripts/has_project_vault_setup.cdc?raw';
import canReceiveToucansTokenScript from './cadence/scripts/can_receive_toucans_token.cdc?raw';
import canReceiveProjectTokenScript from './cadence/scripts/can_receive_project_token.cdc?raw';
import canReceiveNFTCollectionScript from './cadence/scripts/can_receive_nft_collection.cdc?raw';
import getBatchAmountsScript from './cadence/scripts/get_batch_amounts.cdc?raw';
import getFlowBalanceScript from './cadence/scripts/get_flow_balance.cdc?raw';
import getProjectBalancesScript from './cadence/scripts/get_project_balances.cdc?raw';
import getStableSwapPoolInfoScript from './cadence/scripts/get_stable_swap_pool_info.cdc?raw';
import getCatalogSpecificNFTsByIDScript from './cadence/scripts/get_catalog_specific_nfts_by_id.cdc?raw';
import getCatalogSpecificNFTsIDsScript from './cadence/scripts/get_catalog_specific_nfts_ids.cdc?raw';
// NFTCatalog
import getCatalogKeysScript from './cadence/scripts/get_catalog_keys.cdc?raw';
import getCatalogListScript from './cadence/scripts/get_catalog_list.cdc?raw';
import getCatalogNFTsScript from './cadence/scripts/get_catalog_nfts.cdc?raw';
import getCatalogSpecificNFTsScript from './cadence/scripts/get_catalog_specific_nfts.cdc?raw';
import ownsNFTFromCatalogScript from './cadence/scripts/owns_nft_from_catalog.cdc?raw';

import { get } from 'svelte/store';
import { currencies } from '$stores/flow/TokenStore';
import { roundGeneratorData } from '../lib/features/round-generator/stores/RoundGeneratorData';
import type { DAOProject, DaoBlockchainData } from '$lib/types/dao-project/dao-project.interface';
import { ECurrencies } from '$lib/types/common/enums';
import type { DaoGeneratorData } from '$lib/features/dao-generator/types/dao-generator-data.interface';
import type { TransactionStatusObject } from '@onflow/fcl';
import type { ActionExecutionResult } from '$stores/custom/steps/step.interface';
import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
import type { LockedVaultDetails } from '$lib/types/dao-project/lock-tokens/locked-vault-details.interface';
import type { NftCollection } from '$lib/features/nft-treasury/types/nft-collection.interface';
import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';

if (browser) {
	// set Svelte $user store to currentUser,
	// so other components can access it
	fcl.currentUser.subscribe(user.set, []);
}

// Lifecycle FCL Auth functions
export const unauthenticate = () => fcl.unauthenticate();
export const logIn = async () => fcl.logIn();

/********************/

const saveEventAction: (res: TransactionStatusObject) => Promise<ActionExecutionResult> = async (
	executionResult: TransactionStatusObject
) => {
	console.log('[SAVING]: Step 1');
	const res = await fetch('/api/save-event-data', {
		method: 'POST',
		body: JSON.stringify({
			transactionId: executionResult.events[0].transactionId
		}),
		headers: {
			'content-type': 'application/json'
		}
	});

	const response = await res.json();

	return {
		state: 'success',
		errorMessage: response
	};
};

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
		.replaceAll('INSERT DESCRIPTION', data.daoDetails.description.replace(/(\r\n|\n|\r)/gm, ''))
		.replaceAll('INSERT SYMBOL', data.daoDetails.tokenName)
		.replaceAll('INSERT URL', data.daoDetails.website)
		.replaceAll('INSERT TWITTER', data.daoDetails.twitter)
		.replaceAll('INSERT LOGO', data.daoDetails.logoIpfsUrl)
		.replaceAll('INSERT BANNER LOGO', data.daoDetails.bannerLogoIpfsUrl)
		.replaceAll('INSERT DISCORD', data.daoDetails.discord);
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
			arg(paymentCurrencyInfo.receiverPath, t.Path),
			arg(paymentCurrencyInfo.publicPath, t.Path),
			arg(paymentCurrencyInfo.storagePath, t.Path),
			arg(true, t.Bool),
			arg(formatFix(data.tokenomics.initialSupply), t.UFix64),
			arg(
				data.tokenomics.hasMaxSupply ? formatFix(data.tokenomics.maxSupply) : null,
				t.Optional(t.UFix64)
			),
			arg(data.daoDetails.allowedNFTCollections || [], t.Array(t.String))
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

const deployDAONoToken = async (data: DaoGeneratorData) => {
	console.log(data);
	const paymentCurrency = data.tokenomics.paymentCurrency;
	const paymentCurrencyInfo = currencies[paymentCurrency];
	const projectId = data.daoDetails.name.replace(/[^\w\s]|\s/gi, '');
	return await fcl.mutate({
		cadence: replaceWithProperValues(deployDAOTx),
		args: (arg, t) => [
			arg(projectId, t.String),
			arg(data.daoDetails.allowedNFTCollections || [], t.Array(t.String)),
			arg(paymentCurrencyInfo.contractName, t.String),
			arg(addresses[paymentCurrencyInfo.contractName], t.Address),
			arg(paymentCurrencyInfo.symbol, t.String),
			arg(paymentCurrencyInfo.receiverPath, t.Path),
			arg(paymentCurrencyInfo.publicPath, t.Path),
			arg(paymentCurrencyInfo.storagePath, t.Path)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const deployDAONoTokenExecution = (
	data: DaoGeneratorData,
	actionAfterSucceed: (res: TransactionStatusObject) => Promise<ActionExecutionResult>
) => executeTransaction(() => deployDAONoToken(data), actionAfterSucceed);

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
		txCode = switchToToken(txCode, ECurrencies.USDC);
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
	executeTransaction(
		() => fundProject(projectOwner, projectId, amount, message, currency, expectedAmount),
		saveEventAction
	);

const claimOverflow = async (
	projectOwner: string,
	projectId: string,
	amount: string,
	currency: ECurrencies,
	expectedAmount: string
) => {
	let txCode = claimOverflowTx;
	if (currency === ECurrencies.USDC) {
		txCode = switchToToken(txCode, ECurrencies.USDC);
	}
	return await fcl.mutate({
		cadence: replaceWithProperValues(txCode, projectId, projectOwner),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.String),
			arg(formatFix(amount), t.UFix64),
			arg(formatFix(expectedAmount), t.UFix64)
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
	currency: ECurrencies,
	expectedAmount: string
) =>
	executeTransaction(() =>
		claimOverflow(projectOwner, projectId, amount, currency, expectedAmount)
	);

const claimLockedTokens = async (
	projectOwner: string,
	projectId: string,
	lockedVaultUuid: string,
	receiverPublicPath: string
) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(claimLockedTokensTx),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.String),
			arg(lockedVaultUuid, t.UInt64),
			arg({ domain: 'public', identifier: receiverPublicPath }, t.Path)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const claimLockedTokensExecution = (
	projectOwner: string,
	projectId: string,
	lockedVaultUuid: string,
	receiverPublicPath: string
) =>
	executeTransaction(() =>
		claimLockedTokens(projectOwner, projectId, lockedVaultUuid, receiverPublicPath)
	);

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
		txCode = switchToToken(txCode, ECurrencies.USDC);
	}
	return await fcl.mutate({
		cadence: replaceWithProperValues(txCode),
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
) =>
	executeTransaction(
		() => donate(projectOwner, projectId, amount, message, currency),
		saveEventAction
	);

const transferToken = async (amount: string, recipient: string, currency: ECurrencies) => {
	let txCode = transferTokenTx;
	if (currency === ECurrencies.USDC) {
		txCode = switchToToken(txCode, ECurrencies.USDC);
	} else if (currency === ECurrencies.stFlow) {
		txCode = switchToToken(txCode, ECurrencies.stFlow);
	}
	return await fcl.mutate({
		cadence: replaceWithProperValues(txCode),
		args: (arg, t) => [arg(recipient, t.Address), arg(formatFix(amount), t.UFix64)],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const transferTokenExecution = (amount: string, recipient: string, currency: ECurrencies) =>
	executeTransaction(() => transferToken(amount, recipient, currency));

const transferProjectToken = async (
	amount: string,
	recipient: string,
	projectId: string,
	contractAddress: string
) => {
	let script =
		contractAddress === addresses.FlovatarDustToken
			? switchToToken(transferProjectTokenTx, 'DUST')
			: transferProjectTokenTx;
	return await fcl.mutate({
		cadence: replaceWithProperValues(script, projectId, contractAddress),
		args: (arg, t) => [arg(recipient, t.Address), arg(formatFix(amount), t.UFix64)],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const transferProjectTokenExecution = (
	amount: string,
	recipient: string,
	projectId: string,
	contractAddress: string
) => executeTransaction(() => transferProjectToken(amount, recipient, projectId, contractAddress));

const donateNFTs = async (
	projectOwner: string,
	projectId: string,
	nftIDs: string[],
	collectionIdentifier: string,
	message: string
) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(donateNFTsTx),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.String),
			arg(nftIDs, t.Array(t.UInt64)),
			arg(collectionIdentifier, t.String),
			arg(message, t.String)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const donateNFTsExecution = (
	projectOwner: string,
	projectId: string,
	nftIDs: string[],
	collectionIdentifier: string,
	message: string
) =>
	executeTransaction(
		() => donateNFTs(projectOwner, projectId, nftIDs, collectionIdentifier, message),
		saveEventAction
	);

const transferProjectTokenToTreasury = async (
	projectOwner: string,
	contractAddress: string,
	projectId: string,
	amount: string,
	message: string
) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(transferProjectTokenToTreasuryTx, projectId, contractAddress),
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

export const transferProjectTokenToTreasuryExecution = (
	projectOwner: string,
	contractAddress: string,
	projectId: string,
	amount: string,
	message: string
) =>
	executeTransaction(
		() => transferProjectTokenToTreasury(projectOwner, contractAddress, projectId, amount, message),
		saveEventAction
	);

const newRound = async () => {
	const newRoundData = get(roundGeneratorData);
	const fundingGoal = newRoundData.infiniteFundingGoal ? null : formatFix(newRoundData.fundingGoal);
	const startTime = formatFix(newRoundData.startDate);
	const endTime = newRoundData.infiniteDuration ? null : formatFix(newRoundData.endDate);
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

export const newRoundExecution = () => executeTransaction(newRound, saveEventAction);

const editRound = async (
	projectId: string,
	cycleIndex: number,
	startDate: string,
	endDate: string | null,
	reserveRate: number,
	issuanceRate: string,
	fundingGoal: string | null
) => {
	const fundingTarget = fundingGoal && fundingGoal !== '0' ? formatFix(fundingGoal) : null;
	const endTime = endDate && endDate !== '0' ? formatFix(endDate) : null;
	return await fcl.mutate({
		cadence: replaceWithProperValues(editRoundTx),
		args: (arg, t) => [
			arg(projectId, t.String),
			arg(cycleIndex.toString(), t.UInt64),
			arg(formatFix(startDate), t.UFix64),
			arg(endTime, t.Optional(t.UFix64)),
			arg(formatFix(reserveRate / 100.0), t.UFix64),
			arg(formatFix(issuanceRate), t.UFix64),
			arg(fundingTarget, t.Optional(t.UFix64))
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const editRoundExecution = (
	projectId: string,
	cycleIndex: number,
	startDate: string,
	endDate: string | null,
	reserveRate: number,
	issuanceRate: string,
	fundingGoal: string | null
) =>
	executeTransaction(() =>
		editRound(projectId, cycleIndex, startDate, endDate, reserveRate, issuanceRate, fundingGoal)
	);

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

const proposeBatchWithdraw = async (
	tokenSymbol: string,
	amounts: Distribution[],
	projectOwner: string,
	projectId: string
) => {
	const amountsArg: any = amounts.map((distribution) => {
		return { key: distribution.address, value: formatFix(distribution.amount) };
	});

	return await fcl.mutate({
		cadence: replaceWithProperValues(batchWithdrawTokensTx),
		args: (arg, t) => [
			arg(tokenSymbol, t.String),
			arg(amountsArg, t.Dictionary({ key: t.Address, value: t.UFix64 })),
			arg(projectOwner, t.Address),
			arg(projectId, t.String)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const proposeBatchWithdrawExecution = (
	tokenSymbol: string,
	amounts: Distribution[],
	projectOwner: string,
	projectId: string
) => executeTransaction(() => proposeBatchWithdraw(tokenSymbol, amounts, projectOwner, projectId));

const proposeWithdrawNFTs = async (
	projectOwner: string,
	projectId: string,
	collectionIdentifier: string,
	nftIDs: string[],
	recipient: string,
	reasonMessage: string
) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(withdrawNFTsTx),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.String),
			arg(collectionIdentifier, t.String),
			arg(nftIDs, t.Array(t.UInt64)),
			arg(recipient, t.Address),
			arg(reasonMessage, t.String)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const proposeWithdrawNFTsExecution = (
	projectOwner: string,
	projectId: string,
	collectionIdentifier: string,
	nftIDs: string[],
	recipient: string,
	reasonMessage: string
) =>
	executeTransaction(() =>
		proposeWithdrawNFTs(
			projectOwner,
			projectId,
			collectionIdentifier,
			nftIDs,
			recipient,
			reasonMessage
		)
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
	console.log(MSG);
	console.log(latestBlock.height);

	return { keyIds, signatures, MSG, signatureBlock: latestBlock.height };
};

const voteOnAction = async (
	projectOwner: string,
	projectId: string,
	actionUUID: string,
	vote: boolean
) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(voteOnActionTx),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.String),
			arg(actionUUID, t.UInt64),
			arg(vote, t.Bool)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const voteOnActionExecution = (
	projectOwner: string,
	projectId: string,
	actionUUID: string,
	vote: boolean
) =>
	executeTransaction(
		() => voteOnAction(projectOwner, projectId, actionUUID, vote),
		saveEventAction
	);

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
			arg(projectOwner, t.Address),
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

const batchMintTokens = async (
	projectOwner: string,
	projectId: string,
	amounts: Distribution[]
) => {
	const amountsArg: any = amounts.map((distribution) => {
		return { key: distribution.address, value: formatFix(distribution.amount) };
	});
	return await fcl.mutate({
		cadence: replaceWithProperValues(batchMintTokensTx, projectId, projectOwner),
		args: (arg, t) => [
			arg(projectId, t.String),
			arg(projectOwner, t.Address),
			arg(amountsArg, t.Dictionary({ key: t.Address, value: t.UFix64 }))
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const batchMintTokensExecution = (
	projectOwner: string,
	projectId: string,
	amounts: Distribution[]
) => executeTransaction(() => batchMintTokens(projectOwner, projectId, amounts));

const mintTokensToTreasury = async (projectId: string, projectOwner: string, amount: string) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(mintTokensToTreasuryTx),
		args: (arg, t) => [
			arg(projectId, t.String),
			arg(projectOwner, t.Address),
			arg(formatFix(amount), t.UFix64)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const mintTokensToTreasuryExecution = (
	projectId: string,
	projectOwner: string,
	amount: string
) => executeTransaction(() => mintTokensToTreasury(projectId, projectOwner, amount));

const burnTokens = async (
	tokenSymbol: string,
	projectId: string,
	projectOwner: string,
	amount: string
) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(burnTokensTx),
		args: (arg, t) => [
			arg(tokenSymbol, t.String),
			arg(projectId, t.String),
			arg(projectOwner, t.Address),
			arg(formatFix(amount), t.UFix64)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const burnTokensExecution = (
	tokenSymbol: string,
	projectId: string,
	projectOwner: string,
	amount: string
) => executeTransaction(() => burnTokens(tokenSymbol, projectId, projectOwner, amount));

const addAllowedNFTCollections = async (
	projectOwner: string,
	projectId: string,
	collectionIdentifiers: string[]
) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(addAllowedNFTCollectionsTx),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.String),
			arg(collectionIdentifiers, t.Array(t.String))
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const addAllowedNFTCollectionsExecution = (
	projectOwner: string,
	projectId: string,
	collectionIdentifiers: string[]
) =>
	executeTransaction(() =>
		addAllowedNFTCollections(projectOwner, projectId, collectionIdentifiers)
	);

const removeAllowedNFTCollections = async (
	projectOwner: string,
	projectId: string,
	collectionIdentifiers: string[]
) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(removeAllowedNFTCollectionsTx),
		args: (arg, t) => [
			arg(projectOwner, t.Address),
			arg(projectId, t.String),
			arg(collectionIdentifiers, t.Array(t.String))
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const removeAllowedNFTCollectionsExecution = (
	projectOwner: string,
	projectId: string,
	collectionIdentifiers: string[]
) =>
	executeTransaction(() =>
		removeAllowedNFTCollections(projectOwner, projectId, collectionIdentifiers)
	);

const lockTokens = async (
	tokenSymbol: string,
	projectId: string,
	projectOwner: string,
	amount: string,
	recipient: string,
	unlockTimeInUnixSeconds: string
) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(lockTokensTx),
		args: (arg, t) => [
			arg(tokenSymbol, t.String),
			arg(projectId, t.String),
			arg(projectOwner, t.Address),
			arg(formatFix(amount), t.UFix64),
			arg(recipient, t.Address),
			arg(formatFix(unlockTimeInUnixSeconds), t.UFix64)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const lockTokensExecution = (
	tokenSymbol: string,
	projectId: string,
	projectOwner: string,
	amount: string,
	recipient: string,
	unlockTimeInUnixSeconds: string
) =>
	executeTransaction(() =>
		lockTokens(tokenSymbol, projectId, projectOwner, amount, recipient, unlockTimeInUnixSeconds)
	);

const stakeFlow = async (
	projectId: string,
	projectOwner: string,
	flowAmount: number,
	stFlowAmountOutMin: number
) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(stakeFlowTx),
		args: (arg, t) => [
			arg(projectId, t.String),
			arg(projectOwner, t.Address),
			arg(formatFix(flowAmount, 8), t.UFix64),
			arg(formatFix(stFlowAmountOutMin, 8), t.UFix64)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const stakeFlowExecution = (
	projectId: string,
	projectOwner: string,
	flowAmount: number,
	stFlowAmountOutMin: number
) => executeTransaction(() => stakeFlow(projectId, projectOwner, flowAmount, stFlowAmountOutMin));

const unstakeFlow = async (
	projectId: string,
	projectOwner: string,
	stFlowAmount: number,
	flowAmountOutMin: number
) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(unstakeFlowTx),
		args: (arg, t) => [
			arg(projectId, t.String),
			arg(projectOwner, t.Address),
			arg(formatFix(stFlowAmount, 8), t.UFix64),
			arg(formatFix(flowAmountOutMin, 8), t.UFix64)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const unstakeFlowExecution = (
	projectId: string,
	projectOwner: string,
	stFlowAmount: number,
	flowAmountOutMin: number
) => executeTransaction(() => unstakeFlow(projectId, projectOwner, stFlowAmount, flowAmountOutMin));

const setUpVault = async (projectId: string, contractAddress: string) => {
	let script =
		contractAddress === addresses.FlovatarDustToken
			? switchToToken(setUpVaultTx, 'DUST')
			: setUpVaultTx;
	return await fcl.mutate({
		cadence: replaceWithProperValues(script, projectId, contractAddress),
		args: (arg, t) => [],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};

export const setUpVaultExecution = (projectId: string, contractAddress: string) =>
	executeTransaction(() => setUpVault(projectId, contractAddress));

//    _____           _       _
//   / ____|         (_)     | |
//  | (___   ___ _ __ _ _ __ | |_ ___
//   \___ \ / __| '__| | '_ \| __/ __|
//   ____) | (__| |  | | |_) | |_\__ \
//  |_____/ \___|_|  |_| .__/ \__|___/
//                     | |
//                     |_|

export const getProjectInfo: (
	contractAddress: string | null,
	owner: string,
	projectId: string
) => Promise<DaoBlockchainData> = async (contractAddress, owner, projectId) => {
	if (contractAddress) {
		return await getProjectWithTokenInfo(contractAddress, owner, projectId);
	} else {
		return await getProjectNoTokenInfo(owner, projectId);
	}
};

export const getProjectWithTokenInfo: (
	contractAddress: string,
	owner: string,
	projectId: string
) => Promise<DaoBlockchainData> = async (contractAddress, owner, projectId) => {
	try {
		let script =
			contractAddress === addresses.FlovatarDustToken
				? switchToToken(getProjectScript, 'DUST')
				: getProjectScript;
		const response = await fcl.query({
			cadence: replaceWithProperValues(script, projectId, contractAddress),
			args: (arg, t) => [arg(owner, t.Address), arg(projectId, t.String)]
		});
		response.actions = await getProjectActions(owner, projectId);
		return response;
	} catch (e) {
		console.log('Error in getProjectWithTokenInfo');
		console.log(e);
	}
};

const getProjectNoTokenInfo: (
	owner: string,
	projectId: string
) => Promise<DaoBlockchainData> = async (owner, projectId) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getProjectNoTokenScript),
			args: (arg, t) => [arg(owner, t.Address), arg(projectId, t.String)]
		});
		response.actions = await getProjectActions(owner, projectId);
		return response;
	} catch (e) {
		console.log('Error in getProjectNoTokenInfo');
		console.log(e);
	}
};

export const getProjectActions = async (owner: string, projectId: string) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getProjectActionsScript),
			args: (arg, t) => [arg(owner, t.Address), arg(projectId, t.String)]
		});
		return response;
	} catch (e) {
		console.log('Error in getProjectActions');
		console.log(e);
	}
};

function convertTraitsForSpecific(response) {
	for (let i = 0; i < response.length; i++) {
		let nft = response[i];
		nft.traits = nft.traits
			? nft.traits.reduce((obj, item) => Object.assign(obj, { [item.name]: item.value }), {})
			: undefined;
	}
}

export const getProjectSpecificNFTTreasury: (
	owner: string,
	projectId: string,
	collectionIdentifier: string
) => Promise<Nft[]> = async (owner: string, projectId: string, collectionIdentifier: string) => {
	try {
		const collectionIDs = await getProjectSpecificNFTTreasuryIDs(
			owner,
			projectId,
			collectionIdentifier
		);
		const chunkSize = 300;
		let promises = [];
		for (let i = 0; i < collectionIDs.length; i += chunkSize) {
			const chunk = collectionIDs.slice(i, i + chunkSize);
			promises.push(
				fcl.query({
					cadence: replaceWithProperValues(getProjectSpecificNFTTreasuryScript),
					args: (arg, t) => [
						arg(owner, t.Address),
						arg(projectId, t.String),
						arg(collectionIdentifier, t.String),
						arg(chunk, t.Array(t.UInt64))
					]
				})
			);
		}
		let nfts = await Promise.all(promises);
		let ans: Nft[] = [].concat(...nfts);
		convertTraitsForSpecific(ans);
		return ans;
	} catch (e) {
		console.log('Error in getProjectSpecificNFTTreasury');
		console.log(e);
	}
};

export const getProjectSpecificNFTTreasuryIDs: (
	owner: string,
	projectId: string,
	collectionIdentifier: string
) => Promise<Nft[]> = async (owner: string, projectId: string, collectionIdentifier: string) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getProjectSpecificNFTTreasuryIDsScript),
			args: (arg, t) => [
				arg(owner, t.Address),
				arg(projectId, t.String),
				arg(collectionIdentifier, t.String)
			]
		});
		return response;
	} catch (e) {
		console.log('Error in getProjectSpecificNFTTreasuryIDs');
		console.log(e);
	}
};

function convertTraits(response, collectionType: string) {
	if (response[collectionType]) {
		for (let i = 0; i < response[collectionType].length; i++) {
			let nft = response[collectionType][i];
			nft.traits = nft.traits
				? nft.traits.reduce((obj, item) => Object.assign(obj, { [item.name]: item.value }), {})
				: undefined;
		}
	}
}

export const getProjectNFTTreasury: (
	owner: string,
	projectId: string
) => Promise<{
	[collectionIdentifier: string]: Nft[];
}> = async (owner: string, projectId: string) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getProjectNFTTreasuryScript),
			args: (arg, t) => [arg(owner, t.Address), arg(projectId, t.String)]
		});
		convertTraits(response, 'NFLAllDay');
		convertTraits(response, 'NBATopShot');
		return response;
	} catch (e) {
		console.log('Error in getProjectNFTTreasury');
		console.log(e);
	}
};

export const getProjectNFTTreasuryIDs: (
	owner: string,
	projectId: string
) => Promise<{
	[collectionIdentifier: string]: string[];
}> = async (owner: string, projectId: string) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getProjectNFTTreasuryIDsScript),
			args: (arg, t) => [arg(owner, t.Address), arg(projectId, t.String)]
		});
		return response;
	} catch (e) {
		console.log('Error in getProjectNFTTreasuryIDs');
		console.log(e);
	}
};

export const getProjectLockedTokens: (
	owner: string,
	projectId: string
) => Promise<LockedVaultDetails[]> = async (owner, projectId) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getProjectLockedTokensScript),
			args: (arg, t) => [arg(owner, t.Address), arg(projectId, t.String)]
		});
		return response;
	} catch (e) {
		console.log('Error in getProjectLockedTokensScript');
		console.log(e);
	}
};

export const getProjectLockedTokensForUser: (
	owner: string,
	projectId: string,
	forUser: string
) => Promise<LockedVaultDetails[]> = async (owner, projectId, forUser) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getProjectLockedTokensForUserScript),
			args: (arg, t) => [arg(owner, t.Address), arg(projectId, t.String), arg(forUser, t.Address)]
		});
		return response;
	} catch (e) {
		console.log('Error in getProjectLockedTokensForUser');
		console.log(e);
	}
};

export const getTokenBalance = async (projectId: string, contractAddress: string, user: string) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getTokenBalanceScript, projectId, contractAddress),
			args: (arg, t) => [
				arg(user, t.Address),
				arg(projectId, t.String),
				arg(contractAddress, t.Address)
			]
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

export const getFlowBalance = async (userAddress: string) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getFlowBalanceScript),
			args: (arg, t) => [arg(userAddress, t.Address)]
		});
		return response;
	} catch (e) {
		console.log('Error in getBalances');
		console.log(e);
	}
};

export const hasProjectVaultSetup = async (
	contractAddress: string,
	projectId: string,
	userAddress: string
) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(hasProjectVaultSetupScript, projectId, contractAddress),
			args: (arg, t) => [arg(userAddress, t.Address)]
		});
		return response;
	} catch (e) {
		console.log('Error in hasProjectVaultSetup');
		console.log(e);
	}
};

export const canReceiveToucansToken = async (userAddress: string, tokenSymbol: ECurrencies) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(canReceiveToucansTokenScript),
			args: (arg, t) => [arg(userAddress, t.Address), arg(tokenSymbol, t.String)]
		});
		return response;
	} catch (e) {
		return false;
	}
};

export const canReceiveProjectToken = async (
	contractAddress: string,
	projectId: string,
	userAddress: string
) => {
	try {
		let script =
			contractAddress === addresses.FlovatarDustToken
				? switchToToken(canReceiveProjectTokenScript, 'DUST')
				: canReceiveProjectTokenScript;
		const response = await fcl.query({
			cadence: replaceWithProperValues(script, projectId, contractAddress),
			args: (arg, t) => [arg(userAddress, t.Address)]
		});
		return response;
	} catch (e) {
		return false;
	}
};

export const canReceiveNFTCollection = async (
	userAddress: string,
	collectionIdentifier: string
) => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(canReceiveNFTCollectionScript),
			args: (arg, t) => [arg(userAddress, t.Address), arg(collectionIdentifier, t.String)]
		});
		return response;
	} catch (e) {
		return false;
	}
};

export const getCatalogByCollectionIDs = async (
	group: string[]
): Promise<{ [collectionIdentifier: string]: NftCollection } | undefined> => {
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

const getCatalogSpecificNFTsIDs = async (
	user: string,
	collectionIdentifier: string
): Promise<string[]> => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getCatalogSpecificNFTsIDsScript),
			args: (arg, t) => [arg(collectionIdentifier, t.String), arg(user, t.Address)]
		});
		return response;
	} catch (e) {
		console.log('Error in getCatalogSpecificNFTsIDs');
		console.log(e);
		return [];
	}
};

const getCatalogSpecificNFTsByID = async (
	user: string,
	collectionIdentifier: string,
	ids: string[]
): Promise<Nft[]> => {
	try {
		const response = await fcl.query({
			cadence: replaceWithProperValues(getCatalogSpecificNFTsByIDScript),
			args: (arg, t) => [
				arg(collectionIdentifier, t.String),
				arg(user, t.Address),
				arg(ids, t.Array(t.UInt64))
			]
		});

		return response;
	} catch (e) {
		console.log('Error in getCatalogSpecificNFTsByID');
		console.log(e);
		return [];
	}
};

export const getCatalogSpecificNFTs: (
	collectionIdentifier: string,
	user: string
) => Promise<Nft[]> = async (collectionIdentifier: string, user: string) => {
	try {
		const nftIds = await getCatalogSpecificNFTsIDs(user, collectionIdentifier);
		const chunkSize = 300;
		let promises = [];
		for (let i = 0; i < nftIds.length; i += chunkSize) {
			const chunk = nftIds.slice(i, i + chunkSize);
			promises.push(
				fcl.query({
					cadence: replaceWithProperValues(getCatalogSpecificNFTsByIDScript),
					args: (arg, t) => [
						arg(collectionIdentifier, t.String),
						arg(user, t.Address),
						arg(chunk, t.Array(t.UInt64))
					]
				})
			);
		}
		let nfts = await Promise.all(promises);
		let ans: Nft[] = [].concat(...nfts);
		convertTraitsForSpecific(ans);
		return ans;
	} catch (e) {
		console.log('Error in getCatalogSpecificNFTs');
		console.log(e);
		return [];
	}
};

export const getCatalogNFTs: (
	collectionIdentifiers: string[],
	user: string
) => Promise<{
	[collectionIdentifier: string]: Nft[];
}> = async (collectionIdentifiers: string[], user: string) => {
	if (collectionIdentifiers.indexOf('Fantastec-SWAP') > -1) {
		collectionIdentifiers.splice(collectionIdentifiers.indexOf('Fantastec-SWAP'), 1);
	}
	try {
		let batchSize = 15;
		let response = {};
		for (let i = 0; i < collectionIdentifiers.length; i += batchSize) {
			let tempResponse = await fcl.query({
				cadence: replaceWithProperValues(getCatalogNFTsScript),
				args: (arg, t) => [
					arg(collectionIdentifiers.slice(i, i + batchSize), t.Array(t.String)),
					arg(user, t.Address)
				],
				limit: 9999
			});
			response = { ...response, ...tempResponse };
		}

		return response;
	} catch (e) {
		console.log('Error in getCatalogNFTs');
		console.log(e);
		return [];
	}
};

export const getCatalogKeys = async () => {
	try {
		return await fcl.query({
			cadence: replaceWithProperValues(getCatalogKeysScript),
			args: (arg, t) => []
		});
	} catch (e) {
		console.log('Error in getCatalogKeys');
		console.log(e);
	}
};

export const getNFTCatalog: () => Promise<{
	[collectionIdentifier: string]: NftCollection;
}> = async () => {
	try {
		const catalogKeys = await getCatalogKeys();
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
			args: (arg, t) => [arg(userAddress, t.Address), arg(collectionIdentifier, t.String)]
		});
	} catch (e) {
		console.log('Error in ownsNFTFromCatalog', e);
		throw new Error('Error in ownsNFTFromCatalog');
	}
};

export const getBatchAmounts = async (
	projectOwner: string,
	projectId: string,
	actionId: string
) => {
	try {
		return await fcl.query({
			cadence: replaceWithProperValues(getBatchAmountsScript),
			args: (arg, t) => [
				arg(projectOwner, t.Address),
				arg(projectId, t.String),
				arg(actionId, t.UInt64)
			]
		});
	} catch (e) {
		console.log('Error in getBatchAmounts', e);
		throw new Error('Error in getBatchAmounts');
	}
};

export const getProjectBalances = async (
	userAddress: string,
	projects: { [key: string]: string }[]
) => {
	try {
		return await fcl.query({
			cadence: replaceWithProperValues(getProjectBalancesScript),
			args: (arg, t) => [
				arg(userAddress, t.Address),
				arg(projects, t.Dictionary({ key: t.String, value: t.Address }))
			]
		});
	} catch (e) {
		console.log('Error in getProjectBalances', e);
		throw new Error('Error in getProjectBalances');
	}
};

export const getStableSwapPoolInfo = async (amountIn: number, tokenInCurrency: ECurrencies) => {
	try {
		let tokenInKey: string;
		if (tokenInCurrency === ECurrencies.FLOW) {
			tokenInKey = 'A.1654653399040a61.FlowToken';
		} else {
			tokenInKey = 'A.d6f80565193ad727.stFlowToken';
		}
		return await fcl.query({
			cadence: replaceWithProperValues(getStableSwapPoolInfoScript),
			args: (arg, t) => [arg(formatFix(amountIn), t.UFix64), arg(tokenInKey, t.String)]
		});
	} catch (e) {
		console.log('Error in getStableSwapPoolInfo', e);
		throw new Error('Error in getStableSwapPoolInfo');
	}
};
