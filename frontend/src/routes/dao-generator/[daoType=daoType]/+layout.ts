import { getNFTCatalog } from '$flow/actions';
import type { PageLoad } from '../../$types';

export const load: PageLoad = async () => {
	let projectNFTs = await getNFTCatalog();

	return {
		projectNFTs
	};
};
