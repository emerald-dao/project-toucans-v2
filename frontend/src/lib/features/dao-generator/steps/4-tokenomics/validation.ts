import { create, enforce, test, only } from 'vest';

const validationSuite = create((data = {}, currentField) => {
	only(currentField);

	test('editDelay', 'Edit delay is needed', () => {
		enforce(data.editDelay).isNotEmpty();
	});

	test('editDelay', 'Edit delay should be greater than 0', () => {
		enforce(data.editDelay).greaterThan(0);
	});
});

export default validationSuite;
