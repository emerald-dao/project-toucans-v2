import hasFlowVault from '../../../../../src/flow/cadence/scripts/has_flow_vault.cdc?raw';
import { replaceWithProperValues } from '$flow/utils';
import { isValidFlowWallet } from '$lib/utilities/validations/walletAddressValidation';
import { create, each, enforce, only, eager, test } from 'vest';
import * as fcl from '@onflow/fcl';

enforce.extend({ isValidFlowWallet });

export const thresholdSuite = create((data = '', amountOfSignatures) => {
	test(`threshold`, 'Threshold is needed', () => {
		enforce(data).isNotEmpty();
	});

	test(`threshold`, 'Threshold should be greater than or equal to 1', () => {
		enforce(data).greaterThanOrEquals(1);
	});

	test(`threshold`, 'Threshold should be less than or equals to the amount of signatures', () => {
		enforce(data).lessThanOrEquals(amountOfSignatures);
	});
});

export const walletsSuite = create(
	(
		data: {
			address: string;
			id: string;
		}[] = [],
		currentField: string,
		existingSignersAddresses: string[]
	) => {
		only(currentField);
		eager();

		each(data, (field) => {
			test(
				field.id,
				'Wallet address is not valid',
				() => {
					enforce(field.address).isValidFlowWallet();
				},
				field.id
			);
		});

		// Don't allow repited addresses
		const newAddressesArray = data.map((obj) => obj.address);
		const newAddress = data.find((obj) => obj.id === currentField)?.address as string;
		const newAddressIndex = newAddressesArray.indexOf(newAddress);

		newAddressesArray.splice(newAddressIndex, 1);

		const allAddresses = newAddressesArray.concat(existingSignersAddresses);

		each(data, (field) => {
			test(
				field.id,
				'Duplicated wallet address',
				() => {
					enforce(field.address).notInside(allAddresses);
				},
				field.id
			);
		});

		// Check in the blockchain if the address has a Flow vault set up
		each(data, (field) => {
			test.memo(
				field.id,
				"Address doesn't have a vault set up.",
				async () => await checkAddress(field.address),
				[field.address]
			);
		});
	}
);

const checkAddress = async (address: string) => {
	try {
		const walletHasVault = await fcl.query({
			cadence: replaceWithProperValues(hasFlowVault),
			args: (arg, t) => [arg(address, t.Address)]
		});

		if (walletHasVault) {
			return Promise.resolve();
		}

		return Promise.reject('Wallet does not have a vault set up.');
	} catch (error) {
		return Promise.reject('Invalid wallet address');
	}
};
