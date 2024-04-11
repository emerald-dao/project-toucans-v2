import { getProjectNFTTreasury } from '$flow/actions.js';

export const load = async ({ parent }) => {
	const { generalInfo } = await parent();

	return {
		projectNFTTreasury: getProjectNFTTreasury(generalInfo.owner, generalInfo.project_id)
	};
};
