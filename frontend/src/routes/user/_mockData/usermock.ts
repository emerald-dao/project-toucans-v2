import type { UserData } from '../_types/user-data.interface';

export const USER_MOCK: UserData = {
	name: 'mateor.find',
	avatar: '/new-avatar.png',
	address: '0xf8d6e0586b0a20c7',
	signerOf: [
		{
			name: 'Emerald City DAO',
			logoUrl: 'ec-logo.png',
			contractName: 'emeraldDao',
			tokenSymbol: 'EMLD'
		}
	],
	vaults: [
		{
			daoData: {
				name: 'Emerald City DAO',
				logoUrl: 'ec-logo.png',
				contractName: 'emeraldDao',
				tokenSymbol: 'EMLD'
			},
			balance: 7800,
			tokenValue: 1.3
		},
		// {
		// 	daoData: {
		// 		name: 'Emerald City DAO',
		// 		logoUrl: 'ec-logo.png',
		// 		contractName: 'emeraldDao',
		// 		tokenSymbol: 'EMLD'
		// 	},
		// 	balance: 7800,
		// 	tokenValue: 1.3
		// },
		{
			daoData: {
				name: 'Another DAO',
				logoUrl: 'avatar-2.png',
				contractName: 'anotherDao',
				tokenSymbol: 'DAOA'
			},
			balance: 10800,
			tokenValue: 3.3
		}
	],
	transactions: [
		{
			id: 998,
			type: 'Donate',
			timestamp: '2023-06-07T16:51:51.52939+00:00',
			project_id: 'emeraldDao',
			data: {
				by: '0xf8d6e0586b0a20c7',
				amount: '0.95000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: undefined,
				projectOwner: '0xf8d6e0586b0a20c7'
			},
			transaction_id: '5b9ea44e9d246177cda55df173b8d368ae41653c1659c9d7701cc1933f2d4428'
		},
		{
			id: 998,
			type: 'Donate',
			timestamp: '2023-06-07T16:51:51.52939+00:00',
			project_id: 'emeraldDao',
			data: {
				by: '0xf8d6e0586b0a20c7',
				amount: '0.95000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: undefined,
				projectOwner: '0xf8d6e0586b0a20c7'
			},
			transaction_id: '5b9ea44e9d246177cda55df173b8d368ae41653c1659c9d7701cc1933f2d4428'
		},
		{
			id: 998,
			type: 'Donate',
			timestamp: '2023-06-07T16:51:51.52939+00:00',
			project_id: 'emeraldDao',
			data: {
				by: '0xf8d6e0586b0a20c7',
				amount: '0.95000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: undefined,
				projectOwner: '0xf8d6e0586b0a20c7'
			},
			transaction_id: '5b9ea44e9d246177cda55df173b8d368ae41653c1659c9d7701cc1933f2d4428'
		}
	]
};
