import type { Profile } from '$lib/types/common/profile.interface';

const getProfile = async (address: string) => {
	return await fetch(`/api/get-profile/${address}`).then(
		async (data) => (await data.json()) as Profile
	);
};

export default getProfile;
