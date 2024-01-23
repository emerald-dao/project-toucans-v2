export const LEADING_PROJECTS = {
	highTokenPrice: {
		title: '🪙 High Token Price',
		projectId: 'SloppyStakes',
		featuredProperty: {
			property: 'price',
			description: 'Token Price'
		}
	},
	lotsOfNfts: {
		title: '🖼️ Lots of NFTs',
		projectId: 'ADUToken',
		featuredProperty: {
			property: 'nft_count',
			description: 'NFTs in treasury'
		}
	},
	highActivity: {
		title: '🔥 High Activity',
		projectId: 'brasil',
		featuredProperty: {
			property: 'num_participants',
			description: 'DAO participants'
		}
	}
};

export type LeadingProjectType = keyof typeof LEADING_PROJECTS;
