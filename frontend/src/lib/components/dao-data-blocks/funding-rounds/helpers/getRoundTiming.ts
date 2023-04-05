import { daysOfDifference } from '$lib/utilities/formatDate';

export const getRoundTiming = (startDate: Date, endDate: Date | null) => {
	const now = new Date();

	const daysToStart = daysOfDifference(now, startDate);

	if (endDate != null && startDate < now) {
		return `${daysOfDifference(startDate, endDate)} days left`;
	} else if (daysToStart > 0) {
		return `Starts in ${daysToStart} ${daysToStart === 1 ? 'day' : 'days'}`;
	} else if (daysToStart === 0) {
		return `Starts today`;
	} else if (endDate === null) {
		return `Infinite duration`;
	} else if (daysOfDifference(endDate, now) > 0) {
		return `Finished`;
	}
};
