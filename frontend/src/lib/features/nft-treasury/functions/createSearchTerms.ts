import type { Nft } from '../types/nft.interface';

export function createSearchTerms(nfts: Nft[], NBA: boolean = false) {
	let searchByName = nfts.map((item) => ({
		...item,
		searchTerms: NBA
			? `${item.traits['FullName']}`
			: `${item.traits['playerFirstName']} ${item.traits['playerLastName']}`
	}));

	let searchByTeam = nfts.map((item) => ({
		...item,
		searchTerms: NBA ? `${item.traits['TeamAtMoment']}` : `${item.traits['teamName']}`
	}));

	let searchBySetName = nfts.map((item) => ({
		...item,
		searchTerms: NBA ? `${item.traits['SetName']}` : `${item.traits['setName']}`
	}));

	return {
		searchByName,
		searchByTeam,
		searchBySetName
	};
}
