const TOUCANS_STATS = {
	data1: { title: 'DAOs created', stat: undefined },
	data2: { title: 'Total market cap', stat: '+33k' },
	data3: { title: 'Funds raised', stat: '+15k' }
};

export const getToucansStats = (numberOfProjects: number) => {
	return {
		...TOUCANS_STATS,
		data1: {
			...TOUCANS_STATS.data1,
			stat: numberOfProjects.toString()
		}
	};
};
