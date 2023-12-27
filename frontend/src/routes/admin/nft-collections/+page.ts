import type { PageLoad } from './$types';
import { getNFTCatalog } from '$flow/actions';

export const load: PageLoad = async () => {
	let projectNFTs = await getNFTCatalog();

	return {
		projectNFTs
	};
};
