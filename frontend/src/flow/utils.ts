import * as fcl from '@onflow/fcl';
import { transactionStore } from '$stores/flow/TransactionStore';
import { addresses } from '$stores/flow/FlowStore';
import { network } from './config';
import type { TransactionStatusObject } from '@onflow/fcl';
import type { ActionExecutionResult } from '$lib/stores/custom/steps/step.interface';

export function replaceWithProperValues(script, contractName = '', contractAddress = '') {
	return (
		script
			// For Tx/Scripts
			.replace('"../ExampleToken.cdc"', contractAddress)
			.replace('"../utility/NonFungibleToken.cdc"', addresses.NonFungibleToken)
			.replace('"../utility/MetadataViews.cdc"', addresses.MetadataViews)
			.replace('"../utility/FlowToken.cdc"', addresses.FlowToken)
			.replace('"../utility/FUSD.cdc"', addresses.FUSD)
			.replace('"../utility/FungibleToken.cdc"', addresses.FungibleToken)
			.replace('"../utility/FLOAT.cdc"', addresses.FLOAT)
			.replace('"../Toucans.cdc"', addresses.Toucans)
			.replace('"../ToucansTreasuryActions.cdc"', addresses.Toucans)
			.replace('"../ToucansMultiSign.cdc"', addresses.Toucans)
			// Two directories deep
			.replace('"../../ExampleToken.cdc"', contractAddress)
			.replace('"../../utility/NonFungibleToken.cdc"', addresses.NonFungibleToken)
			.replace('"../../utility/MetadataViews.cdc"', addresses.MetadataViews)
			.replace('"../../utility/FlowToken.cdc"', addresses.FlowToken)
			.replace('"../../utility/FUSD.cdc"', addresses.FUSD)
			.replace('"../../utility/FungibleToken.cdc"', addresses.FungibleToken)
			.replace('"../../utility/FLOAT.cdc"', addresses.FLOAT)
			.replace('"../../Toucans.cdc"', addresses.Toucans)
			.replace('"../../ToucansTreasuryActions.cdc"', addresses.Toucans)
			.replace('"../../ToucansMultiSign.cdc"', addresses.Toucans)
			// For Contract
			.replace('"./utility/NonFungibleToken.cdc"', addresses.NonFungibleToken)
			.replace('"./utility/MetadataViews.cdc"', addresses.MetadataViews)
			.replace('"./utility/FungibleToken.cdc"', addresses.FungibleToken)
			.replace('"./utility/FungibleTokenMetadataViews.cdc"', addresses.FungibleTokenMetadataViews)
			.replace('"./utility/FlowToken.cdc"', addresses.FlowToken)
			.replace('"./utility/FUSD.cdc"', addresses.FUSD)
			.replace('"./Toucans.cdc"', addresses.Toucans)
			.replace('"./ToucansMultiSign.cdc"', addresses.Toucans)
			.replace('"./ToucansTreasuryActions.cdc"', addresses.Toucans)
			// For All
			.replaceAll('ExampleToken', contractName)
	);
}

export const executeTransaction: (
	transaction: () => Promise<string>,
	actionAfterSucceed?: (res?: unknown) => Promise<unknown>
) => Promise<ActionExecutionResult> = async (transaction, actionAfterSucceed) => {
	transactionStore.initTransaction();

	try {
		const transactionId = await transaction();

		fcl.tx(transactionId).subscribe(async (res: TransactionStatusObject) => {
			transactionStore.subscribeTransaction(res);
		});

		const executionResult = await fcl
			.tx(transactionId)
			.onceSealed()
			.then((res) => {
				if (actionAfterSucceed) {
					actionAfterSucceed(res)
						.then(() => {
							transactionStore.resetTransaction();

							return {
								state: 'success',
								errorMessage: ''
							} as ActionExecutionResult;
						})
						.catch((e) => {
							transactionStore.resetTransaction();

							return {
								state: 'error',
								errorMessage: 'Error in actionAfterSucceed: ' + e
							} as ActionExecutionResult;
						});
				} else {
					transactionStore.resetTransaction();

					return {
						state: 'success',
						errorMessage: ''
					} as ActionExecutionResult;
				}
			})
			.catch((e) => {
				transactionStore.resetTransaction();

				return {
					state: 'error',
					errorMessage: e
				} as ActionExecutionResult;
			});

		return executionResult;
	} catch (e) {
		transactionStore.resetTransaction();
		console.log('Error in executeTransaction: ', e);

		return {
			state: 'error',
			errorMessage: e
		} as ActionExecutionResult;
	}
};

export const getFindProfile = async (address: string) => {
	try {
		return await fcl.query({
			cadence: `
        import FIND from ${addresses.FIND}
        pub fun main(address: Address): Profile? {
            if let name = FIND.reverseLookup(address) {
              let profile = FIND.lookup(name)!
              return Profile(_name: name, _address: address, _avatar: profile.getAvatar())
            }
            
            return nil
        }

        pub struct Profile {
          pub let name: String
          pub let address: Address
          pub let avatar: String

          init(_name: String, _address: Address, _avatar: String) {
            self.name = _name
            self.address = _address
            self.avatar = _avatar
          }
        }
        `,
			args: (arg, t) => [arg(address, t.Address)]
		});
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const verifyAccountOwnership = async (userObject) => {
	if (!userObject.loggedIn) {
		return false;
	}
	const accountProofService = userObject.services.find(
		(services) => services.type === 'account-proof'
	);
	const fclCryptoContract = network === 'emulator' ? '0xf8d6e0586b0a20c7' : null;
	return await fcl.AppUtils.verifyAccountProof('Toucans', accountProofService.data, {
		fclCryptoContract
	});
};

export const formatFix = (value) => {
	const i = Number.parseFloat(value);
	if (i % 1 == 0) {
		return i.toFixed(1);
	}
	return i;
};
