export const LEADING_PROJECTS = {
	daoParticipants: {
		projectId: 'SloppyStakes',
		featuredProperty: {
			property: 'num_participants',
			description: 'DAO Participants'
		}
	},
	nftsDonated: {
		projectId: 'ADUToken',
		featuredProperty: {
			property: 'nft_count',
			description: 'NFTs Donated'
		}
	},
	totalFunding: {
		projectId: 'BallerzFC',
		featuredProperty: {
			property: 'total_funding',
			description: 'Total Funding'
		}
	},
	tokenHolders: {
		projectId: 'TopShotRewardsCommunity',
		featuredProperty: {
			property: 'num_holders',
			description: 'Token Holders'
		}
	}
};

export type LeadingProjectType = keyof typeof LEADING_PROJECTS;
