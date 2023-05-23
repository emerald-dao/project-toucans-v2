import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

export const DummyDao: DAOProject = {
	generalInfo: {
		contract_address: '0x1234567890',
		contract_name: 'Dummy DAO',
		created_at: '2021-09-01T00:00:00.000Z',
		description: 'This is a dummy DAO',
		discord: 'https://discord.com',
		logo: 'https://via.placeholder.com/150',
		name: 'Dummy DAO',
		owner: '0x1234567890',
		project_id: 1,
		token_symbol: 'DUMMY',
		twitter: 'https://twitter.com',
		type: 'DAO',
		website: 'https://example.com'
	},
	onChainData: {
		projectId: '1',
		projectTokenInfo: {
			contractName: 'DummyToken',
			contractAddress: '0x1234567890',
			tokenType: 'FA2',
			receiverPath: 'receiver',
			publicPath: 'public',
			storagePath: 'storage'
		},
		paymentTokenInfo: {
			contractName: 'DummyToken',
			contractAddress: '0x1234567890',
			tokenType: 'FA2',
			receiverPath: 'receiver',
			publicPath: 'public',
			storagePath: 'storage'
		},
		totalFunding: '10000',
		editDelay: '10000',
		minting: true
	},
	events: [
		{
			projectId: '1',
			by: '0x1234567890',
			tokenType: 'FA2',
			timestamp: 1630454400,
			currentCycle: '1',
			type: 'Mint',
			amount: '1000',
			to: '0x1234567890',
			projectOwner: '0x1234567890'
		},
		{
			projectId: '1',
			by: '0x1234567890',
			tokenType: 'FA2',
			timestamp: 1630454400,
			currentCycle: '1',
			type: 'Purchase',
			amount: '1000',
			message: 'This is a purchase message',
			projectOwner: '0x1234567890'
		},
		{
			projectId: '1',
			by: '0x1234567890',
			tokenType: 'FA2',
			timestamp: 1630454400,
			currentCycle: '1',
			type: 'Withdraw',
			amount: '1000',
			projectOwner: '0x1234567890',
			address: '0x1234567890'
		},
		{
			projectId: '1',
			by: '0x1234567890',
			tokenType: 'FA2',
			timestamp: 1630454400,
			type: 'NewFundingCycle',
			newCycleId: '1',
			fundingTarget: '1000',
			issuanceRate: '1000',
			reserveRate: '1000',
			timeframe: {
				startTime: '1630454400',
				endTime: '1630454400'
			}
		}
	]
};

export const AnotherDummyDao = {
	...DummyDao,
	generalInfo: {
		...DummyDao.generalInfo,
		project_id: 2,
		name: 'Another Dummy DAO'
	},
	onChainData: {
		...DummyDao.onChainData,
		projectId: '2'
	},
	events: DummyDao.events.map((event) => ({
		...event,
		projectId: '2'
	}))
};
