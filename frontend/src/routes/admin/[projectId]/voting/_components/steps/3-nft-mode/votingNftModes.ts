export const VOTING_NFT_MODES: {
	title: string;
	slug: VotingNftModeSlug;
	description: string;
}[] = [
	{
		title: 'No NFTs required',
		slug: 'no-nfts',
		description: 'Anyone can participate in the voting round.'
	},
	{
		title: 'NFT holders',
		slug: 'nft-holders',
		description: 'Users holding an NFT of a selected collection can vote.'
	},
	{
		title: 'NFT donators',
		slug: 'nft-donators',
		description: 'Users that donated an NFT of a selected collection can vote.'
	}
];

export type VotingNftModeSlug = 'no-nfts' | 'nft-holders' | 'nft-donators';
