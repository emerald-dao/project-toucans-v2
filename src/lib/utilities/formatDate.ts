export const formatDate = (date: Date) => {
	const formattedDate = date.toLocaleString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});

	return formattedDate;
};

export const daysOfDifference = (date1: Date, date2: Date) => {
	const _MS_PER_DAY = 1000 * 60 * 60 * 24;
	const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
	const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

export const getMonthsBetweenDates = (startDate: Date, endDate: Date): string[] => {
	const months: string[] = [];
	let currentDate = startDate;
	while (currentDate <= endDate) {
		months.push(
			currentDate.toLocaleString('default', { month: 'long' }) + ' ' + currentDate.getFullYear()
		);
		currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
	}
	return months;
};
