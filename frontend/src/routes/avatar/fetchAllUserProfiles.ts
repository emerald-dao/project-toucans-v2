import type { Profile, ProfileTypes } from '$lib/types/common/profile.interface';

export const fetchAllUserProfiles = async (
	address: string
): Promise<{
	profiles: { [key in ProfileTypes]: Profile | null };
	useFind: boolean;
}> => {
	const res = await fetch(`/api/get-profile/${address}?allProfiles=true`);
	const data = await res.json();

	return data;
};
