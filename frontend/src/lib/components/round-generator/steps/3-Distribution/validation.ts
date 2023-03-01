import { create, enforce, test, only } from 'vest';

const validationSuite = create((data = {}, currentField) => {
	only(currentField);

	test('address', 'Address must be 18 chars long', () => {
		enforce(data[0]).lengthEquals(18);
	});

	test('percentage', 'Address must be 18 chars long', () => {
		enforce(data[1]).greaterThan(0);
	});
});

export default validationSuite;
