import { create, enforce, test, only, skipWhen } from 'vest';

const distributionSuite = create((data = {}, currentField) => {
	only(currentField);

	test('address', 'Address should have 18 chars', () => {
		enforce(data.forAccount).lengthEquals(18);
	});

	skipWhen(distributionSuite.get().hasErrors('address'), () => {
		test.memo(
			'address',
			"Address doesn't exist",
			async () => {
				return await dummyCheckAddress(true);
			},
			[data.forAccount]
		);
	});

	test('amount', 'Amount should me greater than 0', () => {
		enforce(data.amount).greaterThan(0);
	});
});

const dummyCheckAddress = async (success: boolean) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (success) {
				resolve(true);
			} else {
				reject();
			}
		}, 1000);
	});
};

export default distributionSuite;
