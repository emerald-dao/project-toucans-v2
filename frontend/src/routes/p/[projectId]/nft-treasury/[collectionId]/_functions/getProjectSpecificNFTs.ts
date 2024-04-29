import { getProjectSpecificNFTTreasury } from '$flow/actions';

export async function getProjectSpecificNFTs(
	owner: string,
	projectId: string,
	collectionId: string
) {
	let projectSpecificNFTTreasury = await getProjectSpecificNFTTreasury(
		owner,
		projectId,
		collectionId
	);
	return projectSpecificNFTTreasury;
}
