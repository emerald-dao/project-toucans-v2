import { getProjectSpecificNFTTreasury } from '$flow/actions.js';

export const load = async ({ params, parent }) => {
	const { generalInfo } = await parent();

	return {
		projectSpecificNFTTreasury: getProjectSpecificNFTTreasury(
			generalInfo.owner,
			generalInfo.project_id,
			params.collectionId
		)
	};
};
