import { create, enforce, test, only } from 'vest';

const validationSuite = create((data = {}, currentField, maxAmount) => {
	console.log(data, currentField);

	only(currentField);

	test('amount', 'Amount should be greater than 0', () => {
		enforce(data.amount).greaterThan(0);
	});

	if (maxAmount) {
		test('amount', 'Amount should be less than your holdings', () => {
			enforce(data.amount).lessThanOrEquals(maxAmount);
		});
	}
});

export default validationSuite;
