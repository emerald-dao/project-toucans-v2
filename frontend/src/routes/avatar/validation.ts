import { create, enforce, skipWhen, test } from 'vest';
import { supabase } from '$lib/supabaseClient';

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

	skipWhen(validationSuite.get().hasErrors('user-name'), () => {
		test.memo(
			'user-name',
			'Username already taken',
			async () => {
				await checkIfUsernameExists(userName);
			},
			[userName]
		);
	});
});

export default validationSuite;

const checkIfUsernameExists = async (username: string) => {
	return new Promise((resolve, reject) => {
		supabase
			.from('profiles')
			.select('user_name')
			.eq('user_name', username)
			.then((response) => {
				if (response.error) {
					reject();
				}
				if (response.data && response.data.length > 0) {
					reject();
				}
				resolve(true);
			});
	});
};
