import { derived, readable, type Readable } from 'svelte/store';
import type {
	RemainingTime,
	VotingRoundStatus
} from '../../../../routes/p/[projectId]/voting-rounds/[votingRoundId]/_components/voting-widget/voting-round-status.type';
import { getLocalTimeZone, now as getNow, ZonedDateTime } from '@internationalized/date';
import { postgreTimestampToDateTime } from './postgreTimestampToDateTime';
import { getUserVotingEligibility, type VotingEligibility } from './getUserVotingEligibility';
import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';

export type VotingRoundStoreData = {
	votingStatus: VotingRoundStatus;
	votingElegibility: Promise<VotingEligibility>;
	remainingTime: RemainingTime;
};

export const createVotingRoundStore = (
	votingRound: VotingRound,
	userAddress: string | null
): Readable<VotingRoundStoreData> => {
	const formattedEndTimestamp = postgreTimestampToDateTime(votingRound.end_date);
	const formattedStartTimestamp = postgreTimestampToDateTime(
		votingRound.start_date ?? votingRound.created_at
	);

	const now = readable(getNow(getLocalTimeZone()), (set) => {
		const interval = setInterval(() => {
			set(getNow(getLocalTimeZone()));
		}, 1000);
		return () => clearInterval(interval);
	});

	const votingStatus = derived(now, ($now) =>
		getVotingStatus(formattedEndTimestamp, formattedStartTimestamp, $now)
	);

	const remainingTime = readable<RemainingTime>(
		getRemainingTime(formattedEndTimestamp, formattedStartTimestamp),
		(set) => {
			const update = () => set(getRemainingTime(formattedEndTimestamp, formattedStartTimestamp));

			update();

			const interval = setInterval(update, 1000);

			return () => clearInterval(interval);
		}
	);

	const votingElegibility = derived(votingStatus, ($votingStatus) => {
		return getUserVotingEligibility(userAddress, votingRound, $votingStatus);
	});

	return derived(
		[votingStatus, remainingTime, votingElegibility],
		([$votingStatus, $remainingTime, $votingElegibility]) => ({
			votingStatus: $votingStatus,
			votingElegibility: $votingElegibility,
			remainingTime: $remainingTime
		})
	);
};

export type VotingRoundStore = ReturnType<typeof createVotingRoundStore>;

const getVotingStatus = (
	endTimestamp: ZonedDateTime,
	startTimestamp: ZonedDateTime,
	now: ZonedDateTime
): VotingRoundStatus => {
	if (now.compare(startTimestamp) < 0) {
		return 'upcoming';
	}
	if (now.compare(endTimestamp) > 0) {
		return 'ended';
	}
	return 'active';
};

const getRemainingTime = (
	endTimestamp: ZonedDateTime,
	startTimestamp: ZonedDateTime
): RemainingTime => {
	const now = getNow(getLocalTimeZone());
	if (startTimestamp && now < startTimestamp) {
		return getRemainingTimeFromStart(startTimestamp);
	}
	return getRemainingTimeFromEnd(endTimestamp);
};

const getRemainingTimeFromStart = (startTimestamp: ZonedDateTime): RemainingTime => {
	const now = getNow(getLocalTimeZone());
	const timeDiff = startTimestamp.compare(now);
	return getTimeDiff(timeDiff);
};

const getRemainingTimeFromEnd = (endTimestamp: ZonedDateTime): RemainingTime => {
	const now = getNow(getLocalTimeZone());
	const timeDiff = endTimestamp.compare(now);
	return getTimeDiff(timeDiff);
};

const getTimeDiff = (timeDiff: number): RemainingTime => {
	const seconds = Math.floor(timeDiff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	return {
		seconds: seconds % 60,
		minutes: minutes % 60,
		hours: hours % 24,
		days: days
	};
};
