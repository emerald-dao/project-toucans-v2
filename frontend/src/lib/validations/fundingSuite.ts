import { create, enforce, test, only } from 'vest';

const fundingSuite = create((data = {}, currentField) => {
	only(currentField);

	test('amount', 'Amount should be greater than 0', () => {
		enforce(data.amount).greaterThan(0);
	});

	test('message', 'Message should be longer than 5 chars', () => {
		enforce(data.specialMessage).longerThan(5);
	});
});

export default fundingSuite;
