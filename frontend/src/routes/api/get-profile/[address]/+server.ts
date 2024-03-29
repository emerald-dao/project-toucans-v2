import { getFindProfileFromAddressOrName } from '$flow/utils.js';
import { supabase } from '$lib/supabaseClient.js';
import type { Profile } from '$lib/types/common/profile.interface.js';
import getRandomUserNumber from '../../../u/[address]/_features/userNames/getRandomUserNumber.js';
import RANDOM_USERS from '../../../u/[address]/_features/userNames/randomUsers.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, setHeaders, url }) {
	// setHeaders({ 'cache-control': 'max-age=0, public' });
	console.log('bala');

	const allProfiles = url.searchParams.get('allProfiles') === 'true' ?? false;

	console.log(url.searchParams.get('allProfiles'));
	console.log(allProfiles);

	const profile = await fetchProfile(params.address, allProfiles);

	return new Response(JSON.stringify(profile));
}

const fetchProfile = async (
	walletAddress: string,
	allProfiles: boolean
): Promise<
	| Profile
	| {
			profiles: Profile[];
			useFind: boolean;
	  }
> => {
	const profilesArray = [];

	const { data: toucansProfile, error } = await supabase
		.from('profiles')
		.select(`*`)
		.eq('wallet_address', walletAddress)
		.single();

	if (error) {
		console.error('Error fetching profile', error);
	}

	console.log(toucansProfile?.use_find, allProfiles);

	if (toucansProfile !== null && (toucansProfile.use_find === false || allProfiles === true)) {
		const profile = {
			address: walletAddress,
			name: toucansProfile.user_name,
			avatar: `https://krkzqgakzuzlukwxsgnk.supabase.co/storage/v1/object/public/avatars/${toucansProfile.avatar_url}`,
			type: 'toucans' as const
		};

		if (!allProfiles) {
			console.log('no');

			return profile;
		}

		profilesArray.push(profile);
	}

	const findProfile: Profile | null = await getFindProfileFromAddressOrName(walletAddress);

	if (findProfile) {
		const profile = {
			...findProfile,
			name: `${findProfile.name}.find`,
			type: 'find' as const
		};

		if (!allProfiles) {
			return profile;
		}

		profilesArray.push(profile);
	}

	const profileNumber = getRandomUserNumber(walletAddress, RANDOM_USERS.length);

	const randomProfile = {
		address: walletAddress,
		...RANDOM_USERS[profileNumber],
		type: 'random' as const
	};

	if (!allProfiles) {
		return randomProfile;
	}

	profilesArray.push(randomProfile);

	return {
		profiles: profilesArray,
		useFind: toucansProfile?.use_find ?? true
	};
};
