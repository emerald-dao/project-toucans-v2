import { create, enforce, test } from 'vest';

const validationSuite = create((data = {}) => {
	test('description', 'Description is needed', () => {
		enforce(data.description).isNotBlank();
	});

	test('description', 'Description should be longer than 20 chars', () => {
		enforce(data.description).longerThan(20);
	});
});

export default validationSuite;
