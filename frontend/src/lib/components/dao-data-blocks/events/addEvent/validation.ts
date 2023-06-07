import { create, enforce, test } from 'vest';

const validationSuite = create((data: string) => {
	test(`transaction-id`, 'Transaction ID should be 64 chars long', () => {
		enforce(data.length).equals(64);
	});
});

export default validationSuite;
