import { daysOfDifference } from '$lib/utilities/formatDate';

export const getRoundTiming = (startDate: Date, endDate: Date | null, isActive: boolean) => {
	const now = new Date();

	const daysToStart = daysOfDifference(now, startDate);

	if (endDate != null && (startDate < now && isActive)) {
		return `${daysOfDifference(startDate, endDate)} days left`;
	} else if (endDate === null && isActive) {
		return `Infinite duration`;
	} else if (daysToStart > 0) {
		return `Starts in ${daysToStart} ${daysToStart === 1 ? 'day' : 'days'}`;
	} else if (daysToStart === 0) {
		return `Starts today`;
	} else if (endDate === null) {
		return `Infinite duration`;
	} else {
		return `Finished`;
	}
};
