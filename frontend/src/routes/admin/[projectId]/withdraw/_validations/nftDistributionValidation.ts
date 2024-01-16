import { canReceiveNFTCollection } from '$flow/actions';
import { create, enforce, test, skipWhen } from 'vest';

const nftDistributionValidation = create((address: string, collectionId: string) => {
	test('address', 'Address should have 18 chars', () => {
		enforce(address).lengthEquals(18);
	});

	skipWhen(nftDistributionValidation.get().hasErrors('address'), () => {
		test('address', "Address doesn't have a vault set up.", async () => {
			return (await checkAddress(address, collectionId)) as string;
		});
	});
});

const checkAddress = async (address: string, collectionId: string) => {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			const success = await canReceiveNFTCollection(address, collectionId);

			if (success) {
				resolve(true);
			} else {
				reject();
			}
		}, 1000);
	});
};

export default nftDistributionValidation;
