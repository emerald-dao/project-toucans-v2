export type VotingRoundStatusStoreData = {
	status: VotingRoundStatus;
	remainingTime?: RemainingTime;
};

export type VotingRoundStatus = 'active' | 'ended' | 'upcoming';

export type RemainingTime = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};
