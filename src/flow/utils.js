import * as fcl from '@onflow/fcl';
import { transactionStore } from '$stores/flow/TransactionStore';
import { addresses } from '$stores/flow/FlowStore';
import { network } from './config';

export function replaceWithProperValues(script, contractName = '', contractAddress = '') {
	return script
		// For Tx/Scripts
		.replace('"../../ExampleFinancial.cdc"', contractAddress)
		.replace('"../../ExampleCommunity.cdc"', contractAddress)
		.replace('"../../ExampleToken.cdc"', contractAddress)
		.replace('"../../utility/NonFungibleToken.cdc"', addresses.NonFungibleToken)
		.replace('"../../utility/MetadataViews.cdc"', addresses.MetadataViews)
		.replace('"../../utility/FlowToken.cdc"', addresses.FlowToken)
		.replace('"../../utility/FUSD.cdc"', addresses.FUSD)
		.replace('"../../utility/FungibleToken.cdc"', addresses.FungibleToken)
		.replace('"../../utility/FLOAT.cdc"', addresses.FLOAT)
		.replace('"../../Toucans.cdc"', addresses.Toucans)
		// For Contract
		.replace('"./utility/NonFungibleToken.cdc"', addresses.NonFungibleToken)
		.replace('"./utility/MetadataViews.cdc"', addresses.MetadataViews)
		.replace('"./utility/FungibleToken.cdc"', addresses.FungibleToken)
		.replace('"./utility/FungibleTokenMetadataViews.cdc"', addresses.FungibleTokenMetadataViews)
		.replace('"./utility/FlowToken.cdc"', addresses.FlowToken)
		.replace('"./utility/FUSD.cdc"', addresses.FUSD)
		.replace('"./Toucans.cdc"', addresses.Toucans)
		// For All
		.replaceAll('ExampleFinancial', contractName)
		.replaceAll('ExampleCommunity', contractName)
		.replaceAll('ExampleToken', contractName);
}

export const executeTransaction = async (transaction, actionAfterSucceed) => {
	transactionStore.initTransaction();
	try {
		const transactionId = await transaction();
		console.log(transactionId);
		fcl.tx(transactionId).subscribe((res) => {
			transactionStore.subscribeTransaction(res);
			if (res.status === 4) {
				if (res.statusCode === 0 && actionAfterSucceed != undefined) {
					actionAfterSucceed();
				}
				setTimeout(() => transactionStore.resetTransaction, 2000);
			}
		});
	} catch (e) {
		transactionStore.resetTransaction();
		throw e;
	}
};

export const getFindProfile = async (address) => {
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
	return await fcl.AppUtils.verifyAccountProof('Toucans', accountProofService.data, { fclCryptoContract });
}

export const fclFixArg = (value) => {
	let i = Number.parseFloat(value);
	if (i % 1 == 0) {
		return i.toFixed(1);
	}
	return i;
}