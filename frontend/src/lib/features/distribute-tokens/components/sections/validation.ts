import { create, enforce, test, only, skipWhen } from 'vest';

const validationSuite = create((data = {}, currentField, availableBalance: number | undefined) => {
	only(currentField);

	test('address', 'Address should have 18 chars', () => {
		enforce(data.account).lengthEquals(18);
	});

	skipWhen(validationSuite.get().hasErrors('address'), () => {
		test.memo(
			'address',
			"Address doesn't exist",
			async () => {
				return await dummyCheckAddress(true);
			},
			[data.account]
		);
	});

	test('amount', 'Amount should me greater than 0', () => {
		enforce(data.tokens).greaterThan(0);
	});

	skipWhen(availableBalance === undefined, () => {
		test('amount', 'Amount should be less than your available balance', () => {
			enforce(data.tokens).lessThan(availableBalance);
		});
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

export default validationSuite;
