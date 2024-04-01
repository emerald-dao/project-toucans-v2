import { create, enforce, test } from 'vest';

const validationSuite = create((userName: string) => {
	test('user-name', 'Username is required', () => {
		enforce(userName).isNotEmpty();
	});

	test('user-name', 'Username must be at least 3 characters long', () => {
		enforce(userName).longerThanOrEquals(3);
	});

	test('user-name', 'Username cannot be longer than 20 characters', () => {
		enforce(userName).shorterThanOrEquals(20);
	});

	test('user-name', 'Username cannot end with ".find"', () => {
		enforce(userName).doesNotEndWith('.find');
	});

	test('user-name', 'Username can only contain letters, numbers, and underscores', () => {
		enforce(userName).matches(/^[a-zA-Z0-9_]+$/);
	});
});

export default validationSuite;
