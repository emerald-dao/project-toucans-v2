import type { Round } from '../types/dao-project.interface';

export const getMonthlyFundingFromRounds = (rounds: Round[]): [string, number][] => {
	const monthlySums: [string, number][] = [];
	const startDates = rounds.map((round) => Number(round.startDate));
	const firstMonth = new Date(Math.min(...startDates));
	const finishDates = rounds.map((round) => Number(round.finishDate));
	const lastMonth = new Date(Math.max(...finishDates));

	let currentDate = firstMonth;
	let totalSum = 0;

	while (currentDate <= lastMonth) {
		let monthSum = 0;
		for (const round of rounds) {
			if (currentDate < round.startDate || currentDate > round.finishDate) {
				continue;
			}
			const monthFundings = round.fundings.filter((funding) => {
				const fundingYear = funding.date.getFullYear();
				const fundingMonth = funding.date.getMonth();
				const currentYear = currentDate.getFullYear();
				const currentMonth = currentDate.getMonth();
				return fundingYear === currentYear && fundingMonth === currentMonth;
			});
			monthSum += monthFundings.reduce((total, funding) => total + funding.amount, 0);
		}
		totalSum += monthSum;
		monthlySums.push([
			currentDate.toLocaleString('default', { month: 'long' }) + ' ' + currentDate.getFullYear(),
			totalSum
		]);
		currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
	}

	return monthlySums;
};
