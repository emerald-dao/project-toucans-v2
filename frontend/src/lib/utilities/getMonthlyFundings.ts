import type { TDaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';

export const getMonthlyFundingFromRounds = (actions: TDaoEvent[]) => {
	if (actions) {
		const timeOrderedActions = actions.sort((a, b) => a.timestamp - b.timestamp);

		const generateDatesArray = () => {
			const firstMonth = timeOrderedActions[0];
			const lastMonth = timeOrderedActions[timeOrderedActions.length - 1];

			const firstDate = new Date(firstMonth.timestamp * 1000);
			const lastDate = new Date(lastMonth.timestamp * 1000);

			const firstMonthNumber = firstDate.getMonth();
			const firstYearNumber = firstDate.getFullYear();

			const lastMonthNumber = lastDate.getMonth();
			const lastYearNumber = lastDate.getFullYear();

			const datesArray = [];

			for (let i = firstYearNumber; i <= lastYearNumber; i++) {
				const startMonth = i === firstYearNumber ? firstMonthNumber : 0;
				const endMonth = i === lastYearNumber ? lastMonthNumber : 11;

				for (let j = startMonth; j <= endMonth; j++) {
					datesArray.push(`${j}-${i}`);
				}
			}

			return datesArray;
		};

		const allDatesArray = generateDatesArray();

		const fundingPerMonth = timeOrderedActions.reduce(
			(
				acc: {
					[key: string]: number;
				},
				action
			) => {
				if (action.type === 'Purchase') {
					const date = new Date(action.timestamp * 1000);
					const month = date.getMonth();
					const year = date.getFullYear();

					const key = `${month}-${year}`;

					if (acc[key]) {
						acc[key] += Number(action.amount);
					} else {
						acc[key] = Number(action.amount);
					}
				}
				return acc;
			},
			{}
		);

		const labels = Object.keys(fundingPerMonth);
		const data = Object.values(fundingPerMonth);

		const combineFundingWithAllDates = (
			fundingPerMonth: {
				labels: string[];
				data: number[];
			},
			allDatesArray: string[]
		) => {
			const combinedLabels: string[] = [];
			const combinedData: number[] = [];

			allDatesArray.forEach((date) => {
				if (fundingPerMonth.labels.includes(date)) {
					combinedLabels.push(date);
					combinedData.push(fundingPerMonth.data[fundingPerMonth.labels.indexOf(date)]);
				} else {
					combinedLabels.push(date);
					combinedData.push(0);
				}
			});

			return { labels: combinedLabels, data: combinedData };
		};

		const chartData = combineFundingWithAllDates({ labels, data }, allDatesArray);

		return { labels: chartData.labels, data: chartData.data };
	} else {
		return { labels: [], data: [] };
	}
};
