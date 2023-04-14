import type { RoundStatus } from '$lib/types/dao-project/funding-rounds/round-status.type';

export const getRoundStatus = (
	roundNumber: number,
	activeRound: number | null,
	startDate: Date
): RoundStatus => {
	if (roundNumber === activeRound) {
		return 'active';
	} else {
		if (startDate < new Date()) {
			return 'finished';
		} else if (startDate >= new Date()) {
			return 'upcoming';
		}
	}
	return 'upcoming';
};
