import type { FinancialDao } from '../types/dao-project.interface';
import { DaoType, DaoTags } from '../types/dao-project.interface';
import { Currencies } from '../types/currencies.enum';

export const financialDaoData: FinancialDao = {
	name: 'Emerald City DAO',
	type: DaoType.Financial,
	address: '0x3fewqnj35',
	token: 'ECDAO',
	founder: 'Jacob Tucker',
	dateFounded: new Date(11 / 10 / 2019),
	logoUrl: '/ec-logo.png',
	tags: [DaoTags.Building, DaoTags.Community],
	description:
		'Enim veniam veniam ex ut eiusmod adipisicing cillum nulla excepteur. Ullamco deserunt Lorem non quis. Dolor dolore voluptate non tempor est non aliquip officia Lorem nulla cupidatat enim excepteur. Non proident pariatur minim anim. Adipisicing reprehenderit elit dolor eiusmod do enim fugiat.',
	socials: {
		website: 'ecdao.org',
		twitter: 'emerald-dao',
		discord: 'emerald-dao'
	},
	maxSupply: 8000000,
	circulatingSupply: 3000000,
	// mainHolders: [
	// 	['dene.find', 80000],
	// 	['jacob.find', 80000],
	// 	['mateo.find', 80000],
	// 	['bz.find', 80000]
	// ]
	totalFusdRaised: 2000,
	rounds: [
		{
			status: 'active',
			currency: Currencies.FLOW,
			goal: 30000,
			raised: 14000,
			startDate: new Date(2020, 10, 10),
			finishDate: new Date(2022, 10, 10),
			distributed: false,
			withdrawn: false
		},
		{
			status: 'finished',
			currency: Currencies.FLOW,
			goal: 30000,
			raised: 14000,
			startDate: new Date(2020, 10, 10),
			finishDate: new Date(2021, 10, 10),
			distributed: false,
			withdrawn: false
		},
		{
			status: 'finished',
			currency: Currencies.FLOW,
			goal: 30000,
			raised: 14000,
			startDate: new Date(2020, 10, 10),
			finishDate: new Date(2021, 10, 10),
			distributed: false,
			withdrawn: false
		}
	]
};
