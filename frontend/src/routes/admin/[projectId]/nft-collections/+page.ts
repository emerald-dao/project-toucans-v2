import type { PageLoad } from './$types';
import { getNFTCatalog } from '$flow/actions';

export const load: PageLoad = async () => {
	return {
		projectNFTs: await getNFTCatalog()
	};
};
