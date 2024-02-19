import { readable, type Readable } from 'svelte/store';
import type {
	RemainingTime,
	VotingRoundStatus,
	VotingRoundStatusStoreData
} from '../../../../routes/p/[projectId]/voting-rounds/[votingRoundId]/_components/voting-widget/voting-round-status.type';
import { getLocalTimeZone, now as getNow, ZonedDateTime } from '@internationalized/date';
import { postgreTimestampToDateTime } from './postgreTimestampToDateTime';

export const createVotingRoundStatusStore = (
	endTimestamp: string,
	startTimestamp: string | null
): Readable<VotingRoundStatusStoreData> => {
	const formattedEndTimestamp = postgreTimestampToDateTime(endTimestamp);
	const formattedStartTimestamp = startTimestamp
		? postgreTimestampToDateTime(startTimestamp)
		: undefined;

	return readable<VotingRoundStatusStoreData>(
		getVotingStatusStoreData(formattedEndTimestamp, formattedStartTimestamp),
		(set) => {
			const update = () =>
				set(getVotingStatusStoreData(formattedEndTimestamp, formattedStartTimestamp));

			update();

			const interval = setInterval(update, 1000);

			return () => clearInterval(interval);
		}
	);
};

const getVotingStatusStoreData = (
	endTimestamp: ZonedDateTime,
	startTimestamp?: ZonedDateTime
): VotingRoundStatusStoreData => {
	return {
		status: getVotingStatus(endTimestamp, startTimestamp),
		remainingTime: getRemainingTime(endTimestamp, startTimestamp)
	};
};

export const getVotingStatus = (
	endTimestamp: ZonedDateTime,
	startTimestamp?: ZonedDateTime
): VotingRoundStatus => {
	const now = getNow(getLocalTimeZone());
	if (startTimestamp && now < startTimestamp) {
		return 'upcoming';
	}
	if (now > endTimestamp) {
		return 'ended';
	}
	return 'active';
};

const getRemainingTime = (
	endTimestamp: ZonedDateTime,
	startTimestamp?: ZonedDateTime
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
