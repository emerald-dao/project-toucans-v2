import { invalidate } from '$app/navigation';
import { addAllowedNFTCollectionsExecution } from '$flow/actions';

export const addAllowedNFTCollections = async (
	selectedNFTs: string[],
	owner: string,
	project_id: string
) => {
	return await addAllowedNFTCollectionsExecution(owner, project_id, selectedNFTs).then(() => {
		invalidate('app:project-nfts');
	});
};
