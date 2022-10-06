import './config';
import * as fcl from '@onflow/fcl';
import { browser } from '$app/environment';
import { user } from '$stores/flow/FlowStore';
import { executeTransaction } from './utils';

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
	await fcl.mutate({
		cadence: `
    transaction {
      execute {
        log("Hello from execute")
      }
    }
  `,
		proposer: fcl.currentUser,
		payer: fcl.currentUser,
		limit: 50
	});
};
export const dummyTransactionExecution = () => executeTransaction(dummyTransaction);
