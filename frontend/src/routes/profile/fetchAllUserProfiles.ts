import type { Profile, ProfileTypes } from '$lib/types/common/profile.interface';

export const fetchAllUserProfiles = async (
	address: string
): Promise<{
	profiles: { [key in ProfileTypes]: Profile | null };
	useFind: boolean;
}> => {
	const res = await fetch(`/api/get-profile/${address}?allProfiles=true`);
	const data = (await res.json()) as Profile[];

	// return data;
	return MOCK_PROFILES;
};

const MOCK_PROFILES = {
	profiles: {
		find: {
			name: 'jacob.find',
			address: '0x99bd48c8036e2876',
			avatar: 'https://i.imgur.com/q1zGEnG.jpg',
			type: 'find' as const
		},
		toucans: {
			name: 'jacobemerald',
			address: '0x99bd48c8036e2876',
			avatar: 'https://i.imgur.com/q1zGEnG.jpg',
			type: 'toucans' as const
		},
		random: {
			name: 'jacob.random',
			address: '0x99bd48c8036e2876',
			avatar: 'https://i.imgur.com/q1zGEnG.jpg',
			type: 'random' as const
		}
	},
	useFind: true
};
