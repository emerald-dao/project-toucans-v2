export const VOTING_MODES: {
	title: string;
	slug: VotingModeSlugs;
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
		description:
			'Only users holding a NFT of a selected collection can participate in the voting round.'
	},
	{
		title: 'NFT donators',
		slug: 'nft-donators',
		description:
			'Only users who donated to the DAO a NFT of a selected collection can participate in the voting round.'
	}
];

export type VotingModeSlugs = 'no-nfts' | 'nft-holders' | 'nft-donators';
