import { create, enforce, test, only } from 'vest';

const distributionSuite = create((data = {}, currentField) => {
	only(currentField);

	test('destinationAccount', 'Address should be longer than 5 chars', () => {
		enforce(data.destinationAccount).longerThan(5);
	});

	test('amount', 'Amount should me greater than 0', () => {
		enforce(data.amount).greaterThan(0);
	});
});

export default distributionSuite;
