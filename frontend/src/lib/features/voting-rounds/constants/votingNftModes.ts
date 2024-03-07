export const VOTING_NFT_MODES: {
	[key in VotingNftModeSlug]: {
		title: string;
		description: string;
	};
} = {
	'no-nfts': {
		title: 'Open Vote',
		description: 'Every user counts as 1 vote.'
	},
	'nft-holders': {
		title: 'NFT Holders',
		description: 'Every NFT a user holds in their wallet from a selected collection counts as 1 vote.'
	},
	'nft-donators': {
		title: 'NFT Donators',
		description: 'Every NFT a user donated to the DAO from a selected collection counts as 1 vote.'
	}
};

export type VotingNftModeSlug = 'no-nfts' | 'nft-holders' | 'nft-donators';
