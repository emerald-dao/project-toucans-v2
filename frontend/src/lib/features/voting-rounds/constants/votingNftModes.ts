export const VOTING_NFT_MODES: {
	[key in VotingNftModeSlug]: {
		title: string;
		description: string;
	};
} = {
	'no-nfts': {
		title: 'Open votation',
		description: 'Anyone can participate in the voting round.'
	},
	'nft-holders': {
		title: 'NFT holders',
		description: 'Users holding an NFT of a selected collection can vote.'
	},
	'nft-donators': {
		title: 'NFT donators',
		description: 'Users that donated an NFT of a selected collection can vote.'
	}
};

export type VotingNftModeSlug = 'no-nfts' | 'nft-holders' | 'nft-donators';
