export const VOTING_MODES: {
	[key in VotingModeSlug]: {
		title: string;
		description: string;
		warning?: string;
	};
} = {
	'no-nfts': {
		title: 'Open Vote',
		description: 'Every user counts as 1 vote. Anyone can vote.'
	},
	'nft-holders': {
		title: 'NFT Holders',
		description:
			'Every NFT a user holds in their wallet from a selected collection counts as 1 vote.'
	},
	'nft-donators': {
		title: 'NFT Donators',
		description: 'Every NFT a user donated to the DAO from a selected collection counts as 1 vote.'
	},
	'token-holders': {
		title: 'Token Holders',
		description: 'Every DAO token a user holds in their wallet counts as 1 vote.',
		warning:
			'Users can potentially transfer tokens to other wallets to increase their voting power.'
	}
};

export type VotingModeSlug = 'no-nfts' | 'nft-holders' | 'nft-donators' | 'token-holders';
