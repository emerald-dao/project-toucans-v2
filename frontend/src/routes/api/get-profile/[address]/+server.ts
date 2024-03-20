import { getFindProfileFromAddressOrName } from '$flow/utils.js';
import { supabase } from '$lib/supabaseClient.js';
import type { Profile } from '$lib/types/common/profile.interface.js';
import getRandomUserNumber from '../../../u/[address]/_features/userNames/getRandomUserNumber.js';
import RANDOM_USERS from '../../../u/[address]/_features/userNames/randomUsers.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, setHeaders }) {
	const fetchProfile = async () => {
		const address = params.address;

		const { data: toucansProfile, error } = await supabase
			.from('profiles')
			.select(`*`)
			.eq('wallet_address', address)
			.single();

		if (error) {
			console.error('Error fetching profile', error);
		}

		if (toucansProfile !== null && toucansProfile.use_find === false) {
			return {
				address,
				name: toucansProfile.user_name,
				avatar: `https://krkzqgakzuzlukwxsgnk.supabase.co/storage/v1/object/public/avatars/${toucansProfile.avatar_url}`,
				type: 'toucans'
			};
		}

		const findProfile: Profile | null = await getFindProfileFromAddressOrName(address);

		if (findProfile) {
			return {
				...findProfile,
				type: 'find'
			};
		}

		const profileNumber = getRandomUserNumber(address, RANDOM_USERS.length);

		return {
			address,
			...RANDOM_USERS[profileNumber],
			type: 'random'
		};
	};

	setHeaders({ 'cache-control': 'max-age=86400, public' });

	const profile = await fetchProfile();

	return new Response(JSON.stringify(profile));
}
