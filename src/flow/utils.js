import * as fcl from '@onflow/fcl';
import { get } from 'svelte/store';
import { transactionStore } from '$stores/flow/TransactionStore';

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
        import FIND from ${get(addresses).FIND}
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
