import { invalidate } from '$app/navigation';
import { removeAllowedNFTCollectionsExecution } from '$flow/actions';

export const removeAllowedNFTCollections = async (
	removedNFT: string[],
	owner: string,
	project_id: string
) => {
	return await removeAllowedNFTCollectionsExecution(owner, project_id, removedNFT).then(() => {
		invalidate('app:project-nfts');
	});
};
