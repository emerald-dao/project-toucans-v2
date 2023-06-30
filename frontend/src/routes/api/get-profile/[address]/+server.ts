import { getFindProfile } from '$flow/utils.js';
import type { Profile } from '$lib/types/common/profile.interface.js';
import getRandomUserNumber from '../../../u/[address]/_features/userNames/getRandomUserNumber.js';
import RANDOM_USERS from '../../../u/[address]/_features/userNames/randomUsers.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, setHeaders }) {
	const fetchProfile = async () => {
		const address = params.address;

		const findProfile: Profile | null = await getFindProfile(address);

		if (findProfile) {
			return findProfile;
		} else {
			const profileNumber = getRandomUserNumber(address, RANDOM_USERS.length);

			return {
				address,
				...RANDOM_USERS[profileNumber]
			};
		}
	};

	setHeaders({ 'cache-control': 'max-age=600' });

	const profile = await fetchProfile();

	console.log('profile', profile);

	return new Response(JSON.stringify(profile));
}
