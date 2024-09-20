import { getFindProfileFromAddressOrName } from '$flow/utils.js';
import { supabase } from '$lib/supabaseClient.js';
import type { Profile, ProfileTypes } from '$lib/types/common/profile.interface.js';
import getRandomUserNumber from '../../../u/[address]/_features/userNames/getRandomUserNumber.js';
import RANDOM_USERS from '../../../u/[address]/_features/userNames/randomUsers.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, setHeaders, url }) {
	const allProfiles = url.searchParams.get('allProfiles') === 'true' ?? false;

	if (!allProfiles) {
		setHeaders({
			'cache-control': 'max-age=60, s-maxage=60, stale-while-revalidate=86400, public'
		});
	}

	const profile = await fetchProfile(params.address, allProfiles);

	return new Response(JSON.stringify(profile));
}

const fetchProfile = async (
	walletAddress: string,
	allProfiles: boolean
): Promise<
	| Profile
	| {
			profiles: { [key in ProfileTypes]: Profile | null };
			useFind: boolean;
	  }
> => {
	const allProfilesObj: {
		[key in ProfileTypes]: Profile | null;
	} = {
		find: null,
		random: null,
		toucans: null
	};

	const { data: toucansProfile, error } = await supabase
		.from('profiles')
		.select(`*`)
		.eq('wallet_address', walletAddress)
		.single();

	if (error) {
		// console.error('Error fetching profile', error);
	}

	if (toucansProfile !== null && (toucansProfile.use_find === false || allProfiles === true)) {
		const profile = {
			address: walletAddress,
			name: toucansProfile.user_name,
			avatar: `https://krkzqgakzuzlukwxsgnk.supabase.co/storage/v1/object/public/avatars/${toucansProfile.avatar_url}`,
			type: 'toucans' as const
		};

		if (!allProfiles) {
			return profile;
		}

		allProfilesObj.toucans = profile;
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

		allProfilesObj.find = profile;
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

	allProfilesObj.random = randomProfile;

	return {
		profiles: allProfilesObj,
		useFind: toucansProfile?.use_find ?? findProfile ? true : false
	};
};
