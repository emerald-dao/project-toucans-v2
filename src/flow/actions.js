import './config';
import * as fcl from '@onflow/fcl';
import { Buffer } from 'buffer';
import { browser } from '$app/environment';
import { user } from '$stores/flow/FlowStore';
import { executeTransaction, replaceWithProperValues } from './utils';

import rawContractCode from './cadence/ExampleToken.cdc?raw';
import deployContractTx from './cadence/transactions/deploy_contract.cdc?raw';
import { daoData } from '$stores/generator/DaoDataStore';
import { get } from 'svelte/store';

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
	const contractName = data.daoDetails.name.replace(/\s+/g, "");
	const hexCode = Buffer.from(replaceWithProperValues(rawContractCode, contractName)).toString('hex');
	return await fcl.mutate({
		cadence: replaceWithProperValues(deployContractTx),
		args: (arg, t) => [
			arg(contractName, t.String),
			arg(parseFloat(data.tokenomics.totalSupply).toFixed(2), t.UFix64),
			arg(parseFloat(data.tokenomics.initialRound.issuanceRate).toFixed(2), t.UFix64),
			arg((parseFloat(data.tokenomics.initialRound.reserveRate) / 100.0).toFixed(2), t.UFix64),
			arg(hexCode, t.String)
		],
		proposer: fcl.authz,
		payer: fcl.authz,
		authorizations: [fcl.authz],
		limit: 9999
	});
};
export const deployContractExecution = () => executeTransaction(deployContract);
