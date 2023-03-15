import type { CurrentUserObject } from '@onflow/fcl';

export const addUser = async (user: CurrentUserObject) => {
	const res = await fetch('/api/user', {
		method: 'POST',
		body: JSON.stringify({
			user: user
		}),
		headers: {
			'content-type': 'application/json'
		}
	});

	const response = await res.json();

	return response;
};
