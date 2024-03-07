import { getNFTCatalog } from '$flow/actions';
import type { PageLoad } from '../../$types';

export const load: PageLoad = async () => {
	return {
		projectNFTs: await getNFTCatalog()
	};
};
