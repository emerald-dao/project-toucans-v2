import { ECurrencies } from '$lib/types/common/enums';
import type { Vote } from '$lib/types/dao-project/bot-votes/votes.interface';
import type { DAOProject } from '../../../../lib/types/dao-project/dao-project.interface';

export const MOCK_DAO: DAOProject = {
	generalInfo: {
		contract_address: null,
		created_at: '2021-07-01T19:45:17.000Z',
		description: 'This is a test DAO',
		long_description: 'This is a longer description of the DAO',
		discord: null,
		logo: 'https://i.imgur.com/2e5Ww5j.png',
		banner_image: 'https://i.imgur.com/2e5Ww5j.png',
		name: 'Test DAO',
		owner: '0x1234567890123456789012345678901234567890',
		project_id: '1',
		token_symbol: 'JAJA',
		twitter: null,
		website: null
	},
	onChainData: {
		projectId: '1',
		tokenType: 'nft',
		trading: false,
		lpAddresses: {},
		completedActionIds: {},
		currentFundingCycle: {
			details: {
				cycleId: '1',
				fundingTarget: '1000000000000000000000000',
				issuanceRate: '1000000000000000000000000',
				reserveRate: '1000000000000000000000000',
				timeframe: {
					startTime: '1625166000',
					endTime: '1625166000'
				},
				payouts: [
					{
						address: '0x1234567890123456789012345678901234567890',
						percent: '1000000000000000000000000'
					}
				],
				extra: null
			},
			projectTokensPurchased: '1000000000000000000000000',
			raisedDuringRound: '1000000000000000000000000',
			raisedTowardsGoal: '1000000000000000000000000',
			funders: {
				'0x1234567890123456789012345678901234567890': '1000000000000000000000000'
			}
		},
		paymentCurrency: ECurrencies.FLOW,
		editDelay: '1',
		extra: {},
		fundingCycles: [],
		maxSupply: null,
		minting: false,
		overflowBalance: '0',
		purchasing: false,
		requiredNft: null,
		signers: [],
		threshold: '0',
		treasuryBalances: {},
		balances: {},
		totalSupply: '0',
		actions: []
	},
	votes: [],
	events: [],
	vaultSetup: false,
	hasToken: true,
	funding: {
		numbers: [],
		total_funding: 0,
		funders: {
			address: '',
			amount: 0
		}
	}
};

export const MOCK_VOTINGS: Vote[] = [
	{
		title: 'Test vote',
		description: 'This is a test vote',
		for_total: 1,
		against_total: 0,
		created_at: '2021-07-01T19:45:17.000Z',
		pending: false,
		type: 'Toucans',
		discord_message_link:
			'https://discord.com/channels/123456789012345678/123456789012345678/123456789012345678',
		votes: [
			{
				voter: '0x1234567890123456789012345678901234567890'
			}
		]
	}
];
