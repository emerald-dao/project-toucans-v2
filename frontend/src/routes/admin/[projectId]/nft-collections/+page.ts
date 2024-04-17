import type { PageLoad } from './$types';
import { getNFTCatalog } from '$flow/actions';

export const load: PageLoad = async ({ depends }) => {
	depends('app:project-nfts');

	return {
		projectNFTs: await getNFTCatalog()
	};
};
