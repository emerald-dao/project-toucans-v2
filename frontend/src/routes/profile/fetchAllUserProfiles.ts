import type { Profile } from '$lib/types/common/profile.interface';

export const fetchAllUserProfiles = async (address: string) => {
	const res = await fetch(`/api/get-profile/${address}?allProfiles=true`, {
		headers: {
			'Cache-Control': 'no-cache'
		}
	});
	const data = (await res.json()) as Profile[];

	return MOCK_PROFILES;
};

const MOCK_PROFILES = {
	profiles: [
		{
			name: 'jacob.find',
			address: '0x99bd48c8036e2876',
			avatar: 'https://i.imgur.com/q1zGEnG.jpg',
			type: 'find' as const
		},
		{
			name: 'jacobito',
			address: '0x99bd48c8036e2876',
			avatar: 'https://i.imgur.com/q1zGEnG.jpg',
			type: 'toucans' as const
		}
	],
	useFind: true
};
