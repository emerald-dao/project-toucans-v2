import type { VotingRoundStatus } from './voting-round-status.type';

export const getVotingRoundStatus = (
	startDate: Date,
	endDate: Date | undefined
): VotingRoundStatus => {
	const now = new Date();
	if (now < startDate) {
		return 'upcoming';
	}
	if (endDate === undefined) {
		return 'active';
	}
	if (now > endDate) {
		return 'ended';
	}
	return 'active';
};
