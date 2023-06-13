export const mockDaoData = {
	generalInfo: {
		project_id: 'TestingDAO',
		created_at: '2023-05-29T19:25:41.416328+00:00',
		contract_address: '0xf8d6e0586b0a20c7',
		token_symbol: 'TEST',
		description:
			"An amazing Testing DAO for the people! I'm just editing this DAO to see if the maximum amount of chars permitted here is a good amount or if it is too much or if we need more and I'm getting out of ideas of what to write hello hello jkefqwnjfkqwe kefhjnkqwef fjnwe efwnmef wmnefw efnmw wefnm qefwmnqwef nmwef nmqwef",
		website: 'ecdao.org',
		type: null,
		owner: '0xf8d6e0586b0a20c7',
		name: 'Testing DAO',
		logo: 'https://nftstorage.link/ipfs/bafkreiersm3huyrmo3iv5twp64r7avhlvvd4m3ybdndhjohpnxzmhrphnq',
		twitter: 'emerald_dao',
		discord: 'emeraldcity',
		banner_image:
			'https://nftstorage.link/ipfs/bafybeidmgk2dporx33gy7korosuw2he5naj6cjewcsjp26y6zowthpftpq',
		network: 'emulator',
		long_description:
			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit  kmwef jkfwejkwefnkfnwek nkmef nmefw nm,qwfe nm,qwef nm,efqw nm,n,qwefm nm,qwefnm,wef nm,wefq nm,wef nm,q nm,qwef nm,qefw nm,qwef nm,qwe'
	},
	onChainData: {
		projectId: 'TestingDAO',
		tokenType: {
			type: '',
			kind: 'Resource',
			typeID: 'A.f8d6e0586b0a20c7.TestingDAO.Vault',
			fields: [
				{
					type: {
						kind: 'UInt64'
					},
					id: 'uuid'
				},
				{
					type: {
						kind: 'UFix64'
					},
					id: 'balance'
				}
			],
			initializers: []
		},
		currentFundingCycle: null,
		totalFunding: '0.00000000',
		editDelay: '0.00000000',
		extra: {},
		fundingCycles: [],
		totalSupply: '100.00000000',
		overflowBalance: '0.00000000',
		balances: {},
		treasuryBalances: {
			FLOW: '0.00000000',
			TEST: '100.00000000',
			USDC: '0.00000000'
		},
		funders: {},
		signers: ['0xf8d6e0586b0a20c7'],
		threshold: '1',
		minting: true,
		paymentCurrency: 'FLOW',
		maxSupply: null,
		purchasing: true,
		requiredNft: null,
		trading: false,
		lpAddresses: {},
		actions: []
	},
	events: [
		{
			id: 1038,
			type: 'NewFundingCycle',
			timestamp: '2023-06-07T21:34:26.54335+00:00',
			project_id: 'TestingDAO',
			data: {
				timeframe: {
					endTime: null,
					startTime: '1687556040.00000000'
				},
				newCycleId: '0',
				reserveRate: '0.26000000',
				issuanceRate: '2.00000000',
				projectOwner: '0xf8d6e0586b0a20c7',
				fundingTarget: null
			},
			transaction_id: '049d97eaac5b1471d151e166cbffe8c86389e52941b14180eba03f8aac2d7dcc'
		},
		{
			id: 1022,
			type: 'NewFundingCycle',
			timestamp: '2023-06-07T20:12:31.668761+00:00',
			project_id: 'TestingDAO',
			data: {
				timeframe: {
					endTime: '1688760840.00000000',
					startTime: '1687983240.00000000'
				},
				newCycleId: '2',
				reserveRate: '0.11000000',
				issuanceRate: '43.00000000',
				projectOwner: '0xf8d6e0586b0a20c7',
				fundingTarget: null
			},
			transaction_id: 'dee3847eae28f8b6b5d667d33d0234ad78dc82f43f749516b69fc383e2fd06e4'
		},
		{
			id: 1021,
			type: 'NewFundingCycle',
			timestamp: '2023-06-07T20:11:32.004362+00:00',
			project_id: 'TestingDAO',
			data: {
				timeframe: {
					endTime: null,
					startTime: '1687551180.00000000'
				},
				newCycleId: '1',
				reserveRate: '0.18000000',
				issuanceRate: '4.00000000',
				projectOwner: '0xf8d6e0586b0a20c7',
				fundingTarget: null
			},
			transaction_id: '13481248f69b3c02f749a9a430706cf3409f528a1ac4fadd77114a026911cc5c'
		},
		{
			id: 1010,
			type: 'NewFundingCycle',
			timestamp: '2023-06-07T19:26:00.351421+00:00',
			project_id: 'TestingDAO',
			data: {
				timeframe: {
					endTime: null,
					startTime: '1687375620.00000000'
				},
				newCycleId: '0',
				reserveRate: '0.12000000',
				issuanceRate: '2.00000000',
				projectOwner: '0xf8d6e0586b0a20c7',
				fundingTarget: null
			},
			transaction_id: '228dd5a9d42c9fe9f9085d553d5d92f78d7d8e85d1d75a12c5110d1f2c4cb90c'
		},
		{
			id: 998,
			type: 'Donate',
			timestamp: '2023-06-07T16:51:51.52939+00:00',
			project_id: 'TestingDAO',
			data: {
				by: '0xf8d6e0586b0a20c7',
				amount: '0.95000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0xf8d6e0586b0a20c7'
			},
			transaction_id: '5b9ea44e9d246177cda55df173b8d368ae41653c1659c9d7701cc1933f2d4428'
		},
		{
			id: 972,
			type: 'NewFundingCycle',
			timestamp: '2023-06-06T20:53:53.651667+00:00',
			project_id: 'TestingDAO',
			data: {
				timeframe: {
					endTime: null,
					startTime: '1687380900.00000000'
				},
				newCycleId: '0',
				reserveRate: '0.17000000',
				issuanceRate: '4324.00000000',
				projectOwner: '0xf8d6e0586b0a20c7',
				fundingTarget: null
			},
			transaction_id: 'acae9c505274b716501800b937b8db10a0babee078ab39c94fadb9d204973afe'
		},
		{
			id: 939,
			type: 'NewFundingCycle',
			timestamp: '2023-06-06T02:50:26.908536+00:00',
			project_id: 'TestingDAO',
			data: {
				timeframe: {
					endTime: null,
					startTime: '1686019922.00000000'
				},
				newCycleId: '0',
				reserveRate: '0.00000000',
				issuanceRate: '10.00000000',
				projectOwner: '0xf8d6e0586b0a20c7',
				fundingTarget: '100.00000000'
			},
			transaction_id: '23d507abc8a291b14010ccd094c61e9fd87b674093e2b7425e7f59f14929a31b'
		},
		{
			id: 839,
			type: 'Donate',
			timestamp: '2023-06-03T04:22:35.697398+00:00',
			project_id: 'TestingDAO',
			data: {
				by: '0xf8d6e0586b0a20c7',
				amount: '1.00000000',
				message: '',
				tokenSymbol: 'TEST',
				currentCycle: null,
				projectOwner: '0xf8d6e0586b0a20c7'
			},
			transaction_id: 'e42eccc26301e913833ea1dbfc769d1e2851502950c69694e25e20296d3ff534'
		},
		{
			id: 838,
			type: 'Mint',
			timestamp: '2023-06-03T04:22:17.259527+00:00',
			project_id: 'TestingDAO',
			data: {
				by: '0xf8d6e0586b0a20c7',
				to: '0xf8d6e0586b0a20c7',
				amount: '1.00000000',
				tokenSymbol: 'TEST',
				currentCycle: null
			},
			transaction_id: 'c67e09699eaccb0e30351655aa72a4d24481f12d90f89e010dd0aaeecbff86ea'
		},
		{
			id: 739,
			type: 'NewFundingCycle',
			timestamp: '2023-05-31T23:37:18.068914+00:00',
			project_id: 'TestingDAO',
			data: {
				timeframe: {
					endTime: null,
					startTime: '1685576346.00000000'
				},
				newCycleId: '0',
				reserveRate: '0.08000000',
				issuanceRate: '234.00000000',
				projectOwner: '0xf8d6e0586b0a20c7',
				fundingTarget: null
			},
			transaction_id: 'af840a03a361c3d41f9c85bd5af5463a54a3775a869870e46e0161b7802c34bd'
		},
		{
			id: 689,
			type: 'NewFundingCycle',
			timestamp: '2023-05-31T15:49:15.182684+00:00',
			project_id: 'TestingDAO',
			data: {
				timeframe: {
					endTime: null,
					startTime: '1686239400.00000000'
				},
				newCycleId: '3',
				reserveRate: '0.09000000',
				issuanceRate: '234.00000000',
				projectOwner: '0xf8d6e0586b0a20c7',
				fundingTarget: null
			},
			transaction_id: 'efcd7f0f19c463482e297e56fa1abd25738e375ac99b62f060e2450ced0fa75e'
		},
		{
			id: 686,
			type: 'NewFundingCycle',
			timestamp: '2023-05-31T15:03:12.634453+00:00',
			project_id: 'TestingDAO',
			data: {
				timeframe: {
					endTime: '1692371040.00000000',
					startTime: '1692111840.00000000'
				},
				newCycleId: '2',
				reserveRate: '0.15000000',
				issuanceRate: '342.00000000',
				projectOwner: '0xf8d6e0586b0a20c7',
				fundingTarget: '342324.00000000'
			},
			transaction_id: 'fa18001435eecf2b35868695d6b0149c8a55a3d7aff29b18c12416fe4da0367a'
		},
		{
			id: 685,
			type: 'NewFundingCycle',
			timestamp: '2023-05-31T14:54:46.743811+00:00',
			project_id: 'TestingDAO',
			data: {
				timeframe: {
					endTime: '1688050560.00000000',
					startTime: '1686322560.00000000'
				},
				newCycleId: '1',
				reserveRate: '0.06000000',
				issuanceRate: '432.00000000',
				projectOwner: '0xf8d6e0586b0a20c7',
				fundingTarget: null
			},
			transaction_id: '77c4fdf1c2fd8a04d7b252e65e2ddb955a7d68f1c0a34dbb49ecd1cfa8043d96'
		},
		{
			id: 684,
			type: 'NewFundingCycle',
			timestamp: '2023-05-31T14:46:15.064728+00:00',
			project_id: 'TestingDAO',
			data: {
				timeframe: {
					endTime: '1686062820.00000000',
					startTime: '1685544477.00000000'
				},
				newCycleId: '0',
				reserveRate: '0.12000000',
				issuanceRate: '3.00000000',
				projectOwner: '0xf8d6e0586b0a20c7',
				fundingTarget: null
			},
			transaction_id: '9e9e32c975be94267996eb1c0b84f24d59bb75c9b232969ccd8ba449044242b2'
		},
		{
			id: 681,
			type: 'NewFundingCycle',
			timestamp: '2023-05-31T12:11:41.835064+00:00',
			project_id: 'TestingDAO',
			data: {
				timeframe: {
					endTime: '1686399180.00000000',
					startTime: '1685535197.00000000'
				},
				newCycleId: '0',
				reserveRate: '0.22000000',
				issuanceRate: '9898.00000000',
				projectOwner: '0xf8d6e0586b0a20c7',
				fundingTarget: null
			},
			transaction_id: 'a4eabee5e5ceef1650ec00bf1d0489d683a6d1b099baf256c9b5d116e8cb9b6a'
		},
		{
			id: 644,
			type: 'NewFundingCycle',
			timestamp: '2023-05-30T17:26:41.031077+00:00',
			project_id: 'TestingDAO',
			data: {
				timeframe: {
					endTime: null,
					startTime: '1685467980.00000000'
				},
				newCycleId: '0',
				reserveRate: '0.00000000',
				issuanceRate: '10.00000000',
				projectOwner: '0xf8d6e0586b0a20c7',
				fundingTarget: '100.00000000'
			},
			transaction_id: 'f866e440c192b3209ff38374a502cad85cb1d93b39d3d93b1594c8279a6262be'
		},
		{
			id: 642,
			type: 'NewFundingCycle',
			timestamp: '2023-05-30T12:58:14.694199+00:00',
			project_id: 'TestingDAO',
			data: {
				timeframe: {
					endTime: null,
					startTime: '1685797140.00000000'
				},
				newCycleId: '0',
				reserveRate: '0.10000000',
				issuanceRate: '56.00000000',
				projectOwner: '0xf8d6e0586b0a20c7',
				fundingTarget: null
			},
			transaction_id: '2ae9ce65a95d1de43146f34b76cb1fa4b5cbb1c2718c6379ab4f2202e0828eac'
		},
		{
			id: 635,
			type: 'NewFundingCycle',
			timestamp: '2023-05-29T20:19:32.946079+00:00',
			project_id: 'TestingDAO',
			data: {
				timeframe: {
					endTime: '1685737200.00000000',
					startTime: '1685564400.00000000'
				},
				newCycleId: '0',
				reserveRate: '0.10000000',
				issuanceRate: '20.00000000',
				projectOwner: '0xf8d6e0586b0a20c7',
				fundingTarget: null
			},
			transaction_id: '8d41015a7b621135cbb52dc526a56259b5e71436988dd4feee082ec27c7db0ec'
		}
	],
	votes: [],
	userBalance: '0.00000000',
	vaultSetup: true
};
