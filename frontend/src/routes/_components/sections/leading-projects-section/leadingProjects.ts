export const LEADING_PROJECTS = {
	highActivity: {
		title: '🔥 High Activity',
		projectId: 'SloppyStakes',
		featuredProperty: {
			property: 'num_participants',
			description: 'DAO Participants'
		}
	},
	lotsOfNfts: {
		title: '🖼️ NFT Treasury',
		projectId: 'ADUToken',
		featuredProperty: {
			property: 'nft_count',
			description: 'NFTs Donated'
		}
	},
	mostFunded: {
		title: '💰 High Funding',
		projectId: 'BallerzFC',
		featuredProperty: {
			property: 'total_funding',
			description: 'Total Funding'
		}
	},
	highTokenPrice: {
		title: '🪙 High Token Price',
		projectId: 'brasil',
		featuredProperty: {
			property: 'price',
			description: 'Token Price'
		}
	}
};

export type LeadingProjectType = keyof typeof LEADING_PROJECTS;
