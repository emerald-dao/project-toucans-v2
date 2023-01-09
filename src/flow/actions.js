import './config';
import * as fcl from '@onflow/fcl';
import { Buffer } from 'buffer';
import { browser } from '$app/environment';
import { user } from '$stores/flow/FlowStore';
import { executeTransaction, replaceWithProperValues } from './utils';
import { daoData } from '$stores/generator/DaoDataStore';
import { get } from 'svelte/store';

import rawFinancialTokenCode from './cadence/ExampleFinancial.cdc?raw';
import rawCommunityTokenCode from './cadence/ExampleCommunity.cdc?raw';
import deployFinancialTokenTx from './cadence/transactions/financial/deploy_contract.cdc?raw';
import deployCommunityTokenTx from './cadence/transactions/community/deploy_contract.cdc?raw';

const rawTokenCodes = {
	'Financial': rawFinancialTokenCode,
	'Community': rawCommunityTokenCode
}

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

const deployContract = async () => {
	const data = get(daoData);
	console.log(data);
	const rawContractCode = rawTokenCodes[data.tokenomics.tokenType];
	let contractCode = rawContractCode
		.replace('INSERT NAME', data.daoDetails.name)
		.replace('INSERT DESCRIPTION', data.daoDetails.description)
		.replace('INSERT SYMBOL', data.daoDetails.tokenName)
		.replace('INSERT URL', data.daoDetails.website);
	const contractName = data.daoDetails.name.replace(/\s+/g, "");

	if (data.tokenomics.tokenType == 'Financial') {
		console.log(data.tokenomics.mintTokens);
		contractCode = contractCode.replace('// INSERT MINTING HERE', data.tokenomics.mintTokens ?
			`pub fun mintTokens(amount: UFix64): @Vault {
			pre {
			  amount > 0.0: "Amount minted must be greater than zero"
			}
			ExampleFinancial.totalSupply = ExampleFinancial.totalSupply + amount
			emit TokensMinted(amount: amount)
			return <- create Vault(balance: amount)
		}` : '');
		console.log(contractCode);
		const hexCode = Buffer.from(replaceWithProperValues(contractCode, contractName)).toString('hex');
		return deployFinancialContract(hexCode, contractName, data);
	} else if (data.tokenomics.tokenType == 'Community') {
		const hexCode = Buffer.from(replaceWithProperValues(contractCode, contractName)).toString('hex');
		return deployCommunityContract(hexCode, contractName, data);
	}

};

const deployFinancialContract = async (hexCode, contractName, data) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(deployFinancialTokenTx),
		args: (arg, t) => [
			arg(contractName, t.String),
			arg(parseFloat(data.tokenomics.targetAmount).toFixed(2), t.UFix64),
			arg(parseFloat(data.tokenomics.initialRound.issuanceRate).toFixed(2), t.UFix64),
			arg(parseFloat(data.tokenomics.initialRound.issuanceRate).toFixed(2), t.UFix64),
			arg(parseFloat(data.tokenomics.initialRound.reserveRate / 100.0).toFixed(2), t.UFix64),
			arg(hexCode, t.String)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
}

const deployCommunityContract = async (hexCode, contractName, data) => {
	return await fcl.mutate({
		cadence: replaceWithProperValues(deployCommunityTokenTx),
		args: (arg, t) => [
			arg(contractName, t.String),
			arg(parseFloat(data.tokenomics.totalSupply).toFixed(2), t.UFix64),
			arg(hexCode, t.String)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
}

export const deployContractExecution = () => executeTransaction(deployContract);
