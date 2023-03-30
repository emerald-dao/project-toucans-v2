import { create, enforce, test, only } from 'vest';

const validationSuite = create((claimAmount, currentField, maxAmount) => {
	only(currentField);

	console.log('claimAmount', claimAmount);

	test('amount', 'Amount should be greater than 0', () => {
		enforce(claimAmount).greaterThan(0);
	});

	if (maxAmount) {
		test('amount', 'Amount is bigger that what you are allowed to claim', () => {
			enforce(claimAmount).lessThanOrEquals(maxAmount);
		});
	}
});

export default validationSuite;
