import { canReceiveProjectToken } from '$flow/actions';
import { create, enforce, test, only, skipWhen } from 'vest';

const nftsValidationSuite = create(
	(address: string, currentField, projectOwner: string, projectId: string) => {
		only(currentField);

		test('address', 'Address should have 18 chars', () => {
			enforce(address).lengthEquals(18);
		});

		skipWhen(nftsValidationSuite.get().hasErrors('address'), () => {
			test.memo(
				'address',
				"Address doesn't have a vault set up.",
				async () => {
					return (await checkAddress(address, projectOwner, projectId)) as string;
				},
				[address]
			);
		});
	}
);

const checkAddress = async (address: string, projectOwner: string, projectId: string) => {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			let success = await canReceiveProjectToken(projectOwner, projectId, address);

			if (success) {
				resolve(true);
			} else {
				reject();
			}
		}, 1000);
	});
};

export default nftsValidationSuite;
