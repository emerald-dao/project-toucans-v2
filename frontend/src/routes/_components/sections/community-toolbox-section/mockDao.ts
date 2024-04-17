import type { DAOProject } from '../../../../lib/types/dao-project/dao-project.interface';

export const MOCK_DAO: DAOProject = {
	generalInfo: {
		project_id: 'EmeraldCity',
		created_at: '2023-05-26T18:34:24.472924+00:00',
		contract_address: '0x5643fd47a29770e7',
		token_symbol: 'EMLD',
		description: 'The first DAO on the Flow blockchain. The creators of Toucans.',
		website: 'ecdao.org',
		owner: '0x5643fd47a29770e7',
		name: 'Emerald City',
		logo: 'https://i.imgur.com/dsPY3ct.png',
		twitter: 'emerald_dao',
		discord: 'emerald-city-906264258189332541',
		banner_image: 'https://i.imgur.com/JE5HFpS.jpg'
	},
	votingRounds: [
		{
			id: 63,
			project_id: 'EmeraldCity',
			name: 'Flow Giveaway',
			description: 'Should we withdraw 10 $FLOW from the treasury to a random DAO on Toucans?',
			created_at: '2024-03-07T03:21:42.789942+00:00',
			start_date: null,
			end_date: '2024-03-14T02:16:00+00:00',
			nft_mode: 'no-nfts',
			required_nft_collection_id: '',
			linked_action_id: null,
			linked_action_type: null,
			voting_options: [
				{
					id: 138,
					voting_round_id: 63,
					name: 'Yes',
					description: '',
					option_number: 1
				},
				{
					id: 139,
					voting_round_id: 63,
					name: 'No',
					description: 'If you select this option, you are mean.',
					option_number: 2
				},
				{
					id: 140,
					voting_round_id: 63,
					name: 'Yes, but make it 100 $FLOW instead.',
					description: '',
					option_number: 3
				}
			]
		}
	],
	onChainData: {
		projectId: 'EmeraldCity',
		tokenType: {
			type: '',
			kind: 'Resource',
			typeID: 'A.5643fd47a29770e7.EmeraldCity.Vault',
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
		totalFunding: '230042.40045000',
		editDelay: '259200.00000000',
		fundingCycles: [],
		totalSupply: '400000.00000000',
		overflowBalance: '0.00000000',
		balances: {},
		treasuryBalances: {
			EMLD: '72300.00000000',
			FLOW: '230602.38477239',
			USDC: '12014.25000000'
		},
		signers: ['0x5643fd47a29770e7'],
		threshold: '1',
		minting: true,
		paymentCurrency: 'FLOW',
		maxSupply: null,
		purchasing: true,
		requiredNft: null,
		trading: false,
		allowedNFTCollections: [
			'NFLAllDayPacks',
			'NBATopShot',
			'FLOAT',
			'FlowverseSocks',
			'Doodles',
			'NFLAllDay',
			'UFCStrike',
			'Flovatar',
			'Gaia',
			'Zeedz',
			'Backpack',
			'Wearables',
			'Driverz',
			'Piece'
		],
		lpAddresses: {},
		completedActionIds: {
			'1130600028': false,
			'1143745881': false,
			'1387433347': true,
			'1392532656': true,
			'1403264720': true,
			'1404669853': true,
			'1404672521': true,
			'1404704830': true
		},
		actions: []
	},
	events: [
		{
			id: 1875,
			type: 'DonateNFT',
			timestamp: '2024-01-11T16:55:38.554351+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x84efe65bd9993ff8',
				amount: '1',
				message: '',
				projectOwner: '0x5643fd47a29770e7',
				collectionName: 'NBA-Top-Shot',
				collectionIdentifier: 'NBATopShot',
				collectionExternalURL: 'https://nbatopshot.com'
			},
			transaction_id: 'de5da0197f4ca8c93b658beef86fa488fac82e9e16f07cf3d4978ffd83256f64'
		},
		{
			id: 1752,
			type: 'Withdraw',
			timestamp: '2023-12-20T22:05:43.468209+00:00',
			project_id: 'EmeraldCity',
			data: {
				to: '0x78462ee60d5bad4c',
				amount: '100.00000000',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '7284da00ecadc437f373c397e5bf80c9a1ef2585f434b99856f9ea94b7dd296d'
		},
		{
			id: 1751,
			type: 'UnstakeFlow',
			timestamp: '2023-12-20T21:06:08.021947+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x5643fd47a29770e7',
				amountIn: '9.02681044',
				amountOut: '9.99432239'
			},
			transaction_id: '95d6606940cdb3280bc5b4b1cd6784d3f965d86f1088000cdae213e88b349da6'
		},
		{
			id: 1750,
			type: 'StakeFlow',
			timestamp: '2023-12-20T20:55:26.497888+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x5643fd47a29770e7',
				amountIn: '10.00000000',
				amountOut: '9.02681044'
			},
			transaction_id: '25d5440f71718906c9a33027ce6b4194bd1b63e4ea7af1bc379ce15e3e1f121d'
		},
		{
			id: 1736,
			type: 'BatchWithdraw',
			timestamp: '2023-12-19T05:52:48.987216+00:00',
			project_id: 'EmeraldCity',
			data: {
				amount: '40.00000000',
				failed: [],
				amounts: {
					'0x34b57a6391ed7130': '10.0',
					'0x4aa5b1bcc0c25469': '10.0',
					'0xce9b99eae0189144': '10.0',
					'0xda4d843bad6a6fe8': '10.0'
				},
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '2903f7f39af5bc611a3f51f71f62a4ee9bdad0182414797ccb7c508a59b81880'
		},
		{
			id: 1696,
			type: 'Donate',
			timestamp: '2023-12-11T05:26:38.022149+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0xe298d9e7332b2206',
				amount: '1.00000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: 'a0c248913801126709ae254de90a58f2537728fd3477ea07eba25be032225aa7'
		},
		{
			id: 1677,
			type: 'Donate',
			timestamp: '2023-12-09T03:38:20.739068+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0xe298d9e7332b2206',
				amount: '1.00000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '69bdb13aa6b90df141076c5a226140cb7c40231a0a248a6fade5099324972180'
		},
		{
			id: 1669,
			type: 'Donate',
			timestamp: '2023-12-08T19:17:08.154967+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x99bd48c8036e2876',
				amount: '600.00000000',
				message: 'This is from the Flow marketing team.',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '3292c0540cd4b3924d3851a9189ebbfdd74cc29cde81d84733abfe4944d6976a'
		},
		{
			id: 1668,
			type: 'Withdraw',
			timestamp: '2023-12-08T19:15:46.677202+00:00',
			project_id: 'EmeraldCity',
			data: {
				to: '0x309c72eaa414cdc5',
				amount: '100.00000000',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '351249dfdcdeaeaf074d46a7e2df070dc356139a2dd9338a163d9a5238e5b130'
		},
		{
			id: 1665,
			type: 'Donate',
			timestamp: '2023-12-08T09:10:08.261345+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0xcfb9f487659bf8c3',
				amount: '0.00095000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '7f49cfe58535459f0f077973141cea04e89347ceef4affa75536495fda790583'
		},
		{
			id: 1612,
			type: 'Donate',
			timestamp: '2023-12-02T19:46:17.397634+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x337bf11954a327d1',
				amount: '0.00950000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '8e21b919020bd16e414b888dac632a45cb31e8a36dcbcefefaac0c6f19af7ea0'
		},
		{
			id: 1450,
			type: 'Donate',
			timestamp: '2023-10-09T03:33:06.161442+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x2f9734d194b55b38',
				amount: '0.95000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: 'f8f1b45eea2342b52508d414bcbb002808fe23403cf0cef9a968930f4f9f48c9'
		},
		{
			id: 1416,
			type: 'Donate',
			timestamp: '2023-08-26T08:25:15.613721+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0xeb58cbc1b2675bfe',
				amount: '0.95000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '29e8e9db109921bc3a698a4e2058f723fcf6e5a1d458a1a041a4cf2b4fa372f9'
		},
		{
			id: 1342,
			type: 'Donate',
			timestamp: '2023-07-08T15:44:40.59775+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x196c1869b10635b1',
				amount: '0.69000000',
				message: 'Trying to be first',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '3b9ac1dc131bde4ec8c703004bf631c3b011716cbabfa22b6cd41a8fa6a6cfc0'
		},
		{
			id: 1325,
			type: 'Donate',
			timestamp: '2023-06-26T23:33:07.828102+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x0882db24cc8baa73',
				amount: '0.95000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '4849d4ae3ba749875a6bce49689e84374c8aa9e74b671d7dda0fcd2ac6ec8028'
		},
		{
			id: 1168,
			type: 'Donate',
			timestamp: '2023-06-09T03:24:53.512656+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x0e2bfa10b80f06d8',
				amount: '9.50000000',
				message: 'Thanks for all your hard work! ',
				tokenSymbol: 'USDC',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '993cdbc802be710a4552e2d987639a7d6a048fd9142e5348cf6ea9d896add16f'
		},
		{
			id: 1116,
			type: 'Donate',
			timestamp: '2023-06-08T16:37:31.232794+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x670006a8c3db4136',
				amount: '9.50000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '879fe29b7c093c06898eaed43ce35a3272bb2ce595fdd29b38e7158b74d8febc'
		},
		{
			id: 1397,
			type: 'Donate',
			timestamp: '2023-08-11T18:40:25.89095+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0xdfe2cfa666c433fc',
				amount: '4.75000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '474206220d17db663890f327a0428ee1de24d552fd2dc0938878a7a1f4ec8580'
		},
		{
			id: 985,
			type: 'Donate',
			timestamp: '2023-06-07T10:04:34.685494+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x0f0e04f128cf87de',
				amount: '9.50000000',
				message: 'Heavengod love Emerald City ❤️',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '77807e010952adb06b4b8155a235836c538f686d1de7ed2095f76264b67daf95'
		},
		{
			id: 920,
			type: 'Donate',
			timestamp: '2023-06-05T00:47:48.140673+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x094ed61513863909',
				amount: '4.75000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '824c7b9d7f98c2f1ceba1f4aacc61fc2a0d0c81a4256f932a469894316762ff7'
		},
		{
			id: 911,
			type: 'Donate',
			timestamp: '2023-06-04T23:20:30.420036+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0xea8c25e9d6964258',
				amount: '9.50000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '3d7cd2b9a7e7c73316a5c7db6341d6f1d5c4ad136eda34e232df2bd1d8f9d515'
		},
		{
			id: 909,
			type: 'Donate',
			timestamp: '2023-06-04T21:46:55.690786+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x69ef2e4c117f3270',
				amount: '5.70000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '4956304494ec03a2ac454fb7a0c2cd01ddfcca48aab06af6d0765d0331986afe'
		},
		{
			id: 895,
			type: 'Donate',
			timestamp: '2023-06-04T15:00:54.074264+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0xfcddbc5ac1b0469f',
				amount: '9.50000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '62327e7a09b3ad4308a0cd8249cdb0573dc5010b38d1fdf7f535fcdc7e1e151e'
		},
		{
			id: 894,
			type: 'Donate',
			timestamp: '2023-06-04T13:47:52.972394+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x59e44c782df89aa3',
				amount: '38.95000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '87a2b0afe32876c203b9673d674a48126b984fd6c62bd6840ff3117961a4e132'
		},
		{
			id: 892,
			type: 'Donate',
			timestamp: '2023-06-04T13:25:25.620086+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x05bb872955c66c3e',
				amount: '0.95000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: 'a6ee055c5a65a599e417bc17cc41c1175fc19d5bb0d0307f7aa995de9b6afe2e'
		},
		{
			id: 878,
			type: 'Donate',
			timestamp: '2023-06-04T03:50:12.542981+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0xab41270ee6b2b689',
				amount: '28.50000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: 'f1fac2c29df4cc71faa4d50de6d11e766b5250f81ae669c720827f7e1d2631d2'
		},
		{
			id: 867,
			type: 'Donate',
			timestamp: '2023-06-03T17:04:01.61222+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x34b57a6391ed7130',
				amount: '10.0',
				message: "Love EC & Toucans!! Here''s 10 FLOW to treat yo''self to some gelato!🍨",
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: 'da94f437baf8db1de0cbeaa7c89f724fc68ce3488af8cf6cbbcfa0e598463987'
		},
		{
			id: 836,
			type: 'Donate',
			timestamp: '2023-06-03T00:35:45.061214+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0xe2e73c2e3a23bb66',
				amount: '19.00000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '870a3332c5ac3925f258d2fb9b7915becfd0b4e3c49d26c0a4c7f732c582be05'
		},
		{
			id: 804,
			type: 'Donate',
			timestamp: '2023-06-02T01:22:44.030669+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x0ad58106763504a4',
				amount: '9.50000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: 'e5d6eaa570d193497d3b523a569b021292b6dd54e131ecc01671e9fad1e20416'
		},
		{
			id: 721,
			type: 'Donate',
			timestamp: '2023-05-31T20:41:42.418703+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x75eaf55ba62052d1',
				amount: '4.75000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '2b82aa00b0e660753526cc380d90f5fb94a9d1e8cd7784eef587dd4072feee1b'
		},
		{
			id: 643,
			type: 'Donate',
			timestamp: '2023-05-30T16:00:25.838272+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x8528d8dd8a586f0d',
				amount: '0.95000000',
				message: 'awesome tool',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '5a04bfb5ee553dcf58d4159ac68038486aa887330d6fc2272ca5e124f7ac8d63'
		},
		{
			id: 640,
			type: 'Donate',
			timestamp: '2023-05-29T23:02:25.275882+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x35ee16b62b53d2e2',
				amount: '5.70000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '07d2bf57bb21c4b4358fea92128e0dca61656d238967a186a03a0bdb1dd943c7'
		},
		{
			id: 600,
			type: 'Donate',
			timestamp: '2023-05-28T03:37:24.935096+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0xa920e5f0901bcead',
				amount: '83.6',
				message: 'Emerald City rocksssssssss',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '870eb886ed4302c728cdd1f69d493de27e9f905fa0d6ea0aebff254269b11251'
		},
		{
			id: 591,
			type: 'Donate',
			timestamp: '2023-05-27T16:54:17.660664+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x01d63aa89238a559',
				amount: '4.75000000',
				message: 'We can even write a message here lol',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '6246b5dc73a7fb1e53709c3472b6e899dc7e7fb8c6999fff5082fb9a65ff6dcd'
		},
		{
			id: 558,
			type: 'Donate',
			timestamp: '2023-05-26T23:29:45.590231+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x99bd48c8036e2876',
				amount: '1.00000000',
				message: 'I am a very cool person.',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '3a847578d560ab77144ab1a860110c72d0c76c9abce6e49a0ea06fb92fb3ad59'
		},
		{
			id: 597,
			type: 'Donate',
			timestamp: '2023-05-27T21:38:26.286953+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0xe2e73c2e3a23bb66',
				amount: '4.75000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '29f8e5eb350bb4484286d36cb9bbd6cee75f0344520fe6f02c242314fbd5e5c7'
		},
		{
			id: 599,
			type: 'Donate',
			timestamp: '2023-05-27T23:38:39.523639+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x39911c57ed3b4084',
				amount: '47.50000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '8ef8f9e6f3fd4e7b35166d6466d97b530d728031a83268a59403015c784cd838'
		},
		{
			id: 596,
			type: 'Donate',
			timestamp: '2023-05-27T20:52:03.572503+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x078a8129525775dd',
				amount: '4.75000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: 'd7ad61da77f47c53f1534c22d5b4846423bf63127403ae0fe6dad14b4f46d9ac'
		},
		{
			id: 593,
			type: 'Donate',
			timestamp: '2023-05-27T17:40:01.968279+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x69ef2e4c117f3270',
				amount: '4.75000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: 'fd1560ba417042ed8a28d28a2c36c185aefb30d73a0c04c28acc260623960db5'
		},
		{
			id: 545,
			type: 'Donate',
			timestamp: '2023-05-26T18:38:49.66618+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x11ca36743554b4b0',
				amount: '10.00000000',
				message: 'Andrea loves EC DAO',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: null
		},
		{
			id: 544,
			type: 'ProjectCreated',
			timestamp: '2023-05-26T18:34:24.647059+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0x5643fd47a29770e7',
				tokenTypeIdentifier: 'A.5643fd47a29770e7.EmeraldCity.Vault'
			},
			transaction_id: null
		},
		{
			id: 622,
			type: 'Donate',
			timestamp: '2023-05-29T01:13:39.668438+00:00',
			project_id: 'EmeraldCity',
			data: {
				by: '0xfcbe1e1ed18c5a26',
				amount: '4.75000000',
				message: '',
				tokenSymbol: 'FLOW',
				currentCycle: null,
				projectOwner: '0x5643fd47a29770e7'
			},
			transaction_id: '1b3ab6ae6010ebab73f3ed50adeb478e78b20bd0de94484951948537ba58d525'
		}
	],
	votes: [
		{
			title: 'Emerald City new logo',
			description: 'Is the new logo designed by Mateo better than the old one?',
			for_total: 1328,
			against_total: 321,
			created_at: '2021-07-01T19:45:17.000Z',
			pending: false,
			type: 'Toucans',
			discord_message_link:
				'https://discord.com/channels/123456789012345678/123456789012345678/123456789012345678',
			votes: []
		},
		// invent another votation
		{
			title: 'New domain name',
			description: 'Should we change the domain name to emeraldcitydao.com?',
			for_total: 609,
			against_total: 983,
			created_at: '2021-07-01T19:45:17.000Z',
			pending: false,
			type: 'Toucans',
			discord_message_link:
				'https://discord.com/channels/123456789012345678/123456789012345678/123456789012345678',
			votes: []
		}
	],
	hasToken: true,
	funding: {
		numbers: [
			5.54, 0.55, 2.63, 2.63, 2.63, 2.63, 26.33, 46.35, 2.63, 3.16, 0.53, 2.63, 5.27, 10.53, 5.54,
			15.8, 0.53, 21.59, 5.27, 3.16, 5.27, 2.63, 5.27, 5.27, 9.5, 0.53, 0.38, 2.63, 0.43, 0.42,
			0.01, 0, 482.71, 0.87, 0.78
		],
		total_funding: 170398,
		funders: {
			'0x11ca36743554b4b0': {
				amount: 5.54,
				num_nfts: 0
			},
			'0x01d63aa89238a559': {
				amount: 2.63,
				num_nfts: 0
			},
			'0x078a8129525775dd': {
				amount: 2.63,
				num_nfts: 0
			},
			'0x39911c57ed3b4084': {
				amount: 26.33,
				num_nfts: 0
			},
			'0xa920e5f0901bcead': {
				amount: 46.35,
				num_nfts: 0
			},
			'0xfcbe1e1ed18c5a26': {
				amount: 2.63,
				num_nfts: 0
			},
			'0x35ee16b62b53d2e2': {
				amount: 3.16,
				num_nfts: 0
			},
			'0x8528d8dd8a586f0d': {
				amount: 0.53,
				num_nfts: 0
			},
			'0x75eaf55ba62052d1': {
				amount: 2.63,
				num_nfts: 0
			},
			'0x0ad58106763504a4': {
				amount: 5.27,
				num_nfts: 0
			},
			'0xe2e73c2e3a23bb66': {
				amount: 13.16,
				num_nfts: 0
			},
			'0x69ef2e4c117f3270': {
				amount: 5.79,
				num_nfts: 0
			},
			'0x99bd48c8036e2876': {
				amount: 483.26,
				num_nfts: 0
			},
			'0xfcddbc5ac1b0469f': {
				amount: 5.27,
				num_nfts: 0
			},
			'0xea8c25e9d6964258': {
				amount: 5.27,
				num_nfts: 0
			},
			'0x094ed61513863909': {
				amount: 2.63,
				num_nfts: 0
			},
			'0x0f0e04f128cf87de': {
				amount: 5.27,
				num_nfts: 0
			},
			'0x34b57a6391ed7130': {
				amount: 5.54,
				num_nfts: 0
			},
			'0xab41270ee6b2b689': {
				amount: 15.8,
				num_nfts: 0
			},
			'0x05bb872955c66c3e': {
				amount: 0.53,
				num_nfts: 0
			},
			'0x59e44c782df89aa3': {
				amount: 21.59,
				num_nfts: 0
			},
			'0x670006a8c3db4136': {
				amount: 5.27,
				num_nfts: 0
			},
			'0x0e2bfa10b80f06d8': {
				amount: 9.5,
				num_nfts: 0
			},
			'0x196c1869b10635b1': {
				amount: 0.38,
				num_nfts: 0
			},
			'0x0882db24cc8baa73': {
				amount: 0.53,
				num_nfts: 0
			},
			'0xdfe2cfa666c433fc': {
				amount: 2.63,
				num_nfts: 0
			},
			'0xeb58cbc1b2675bfe': {
				amount: 0.43,
				num_nfts: 0
			},
			'0x2f9734d194b55b38': {
				amount: 0.42,
				num_nfts: 0
			},
			'0x337bf11954a327d1': {
				amount: 0.01,
				num_nfts: 0
			},
			'0xcfb9f487659bf8c3': {
				amount: 0,
				num_nfts: 0
			},
			'0xe298d9e7332b2206': {
				amount: 1.65,
				num_nfts: 0
			},
			'0x84efe65bd9993ff8': {
				amount: 0,
				num_nfts: 1
			}
		}
	}
};

export const MOCK_NFTS = [
	{
		id: '5025450',
		name: 'Brock Purdy',
		thumbnail:
			'https://assets.nflallday.com/resize/editions/dynamic/96462c32-5a9c-48fe-a565-6a3932d3cdb9-l-w16evo/play_96462c32-5a9c-48fe-a565-6a3932d3cdb9-l-w16evo_dynamic_capture_Hero_Black_2880_2880_Black.png?format=webp&quality=80&width=640 1x, https://assets.nflallday.com/resize/editions/dynamic/96462c32-5a9c-48fe-a565-6a3932d3cdb9-l-w16evo/play_96462c32-5a9c-48fe-a565-6a3932d3cdb9-l-w16evo_dynamic_capture_Hero_Black_2880_2880_Black.png?format=webp&quality=80&width=1200 2x',
		serial: '13',
		traits: {
			playType: 'Player Melt',
			editionTier: 'LEGENDARY',
			setName: 'Dynamic',
			seriesName: '2023 Season',
			playerFirstName: 'Brock',
			playerLastName: 'Purdy',
			teamName: 'San Francisco 49ers'
		}
	},
	{
		id: '5025451',
		name: 'Lamar Jackson',
		thumbnail:
			'https://assets.nflallday.com/resize/editions/dynamic/81682c78-d356-4aa0-9e07-a5d84d6d6b04-r-w16evo/play_81682c78-d356-4aa0-9e07-a5d84d6d6b04-r-w16evo_dynamic_capture_Hero_Black_2880_2880_Black.png?format=webp&quality=80&width=640 1x, https://assets.nflallday.com/resize/editions/dynamic/81682c78-d356-4aa0-9e07-a5d84d6d6b04-r-w16evo/play_81682c78-d356-4aa0-9e07-a5d84d6d6b04-r-w16evo_dynamic_capture_Hero_Black_2880_2880_Black.png?format=webp&quality=80&width=1200 2x',
		serial: '31',
		traits: {
			playType: 'Player Melt',
			editionTier: 'RARE',
			setName: 'Dynamic',
			seriesName: '2023 Season',
			playerFirstName: 'Lamar',
			playerLastName: 'Jackson',
			teamName: 'Baltimore Ravens'
		}
	}
];
