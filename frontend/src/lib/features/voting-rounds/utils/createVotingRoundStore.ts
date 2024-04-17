import { derived, readable, writable } from 'svelte/store';
import { getLocalTimeZone, now as getNow, ZonedDateTime } from '@internationalized/date';
import { postgreTimestampToDateTime } from './postgreTimestampToDateTime';
import { getUserVotingEligibility } from './getUserVotingEligibility';
import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
import { user } from '../../../stores/flow/FlowStore';
import { supabase } from '$lib/supabaseClient';
import type { Vote } from '$lib/utilities/api/supabase/fetchVotingRoundVotes';
import type {
	RemainingTime,
	VotingRoundStatus
} from '../components/voting-widget/voting-round-status.type';

export const createVotingRoundStore = (
	votingRound: VotingRound,
	userAddress: string | null,
	tokenContactAddress: string | null
) => {
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

	const allVotes = createAllVotesStore(votingRound);

	const votingElegibility = derived(
		[votingStatus, allVotes],
		async ([$votingStatus, $allVotes]) => {
			const votes = await $allVotes;

			return getUserVotingEligibility(
				userAddress,
				votingRound,
				$votingStatus,
				votes,
				tokenContactAddress
			);
		}
	);

	const userVotes = derived([user, allVotes], async ([$user, $allVotes]) => {
		const votes = await $allVotes;

		return votes.filter((vote) => vote.wallet_address === $user?.addr);
	});

	const votesResults = derived(allVotes, async ($allVotes) => {
		const votes = await $allVotes;
		const isNftMode =
			votingRound.nft_mode === 'nft-donators' || votingRound.nft_mode === 'nft-holders';
		const isTokenMode = votingRound.nft_mode === 'token-holders';

		const votingOptions = votingRound.voting_options.reduce((acc, option) => {
			acc[option.id] = 0;
			return acc;
		}, {} as Record<string, number>);

		const results = votes.reduce((acc, vote) => {
			if (isNftMode && vote.nft_uuids && vote.nft_uuids.length > 0) {
				acc[vote.selected_option] += vote.nft_uuids.length;
			} else if (isTokenMode && vote.amount_of_tokens) {
				acc[vote.selected_option] += vote.amount_of_tokens;
			} else if (!isNftMode) {
				acc[vote.selected_option] += 1;
			}
			return acc;
		}, votingOptions);

		return results;
	});

	const mostVotedOptions = derived(votesResults, async ($votesResults) => {
		const results = await $votesResults;

		const maxVotes = Math.max(...Object.values(results));
		const mostVotedOptions = Object.keys(results).filter((option) => results[option] === maxVotes);

		return mostVotedOptions;
	});

	const { subscribe } = derived(
		[
			votingStatus,
			remainingTime,
			votingElegibility,
			allVotes,
			userVotes,
			votesResults,
			mostVotedOptions
		],
		([
			$votingStatus,
			$remainingTime,
			$votingEligibility,
			$allVotes,
			$userVotes,
			$votesResults,
			$mostVotedOptions
		]) => ({
			votingStatus: $votingStatus,
			votingEligibility: $votingEligibility,
			remainingTime: $remainingTime,
			allVotes: $allVotes,
			userVotes: $userVotes,
			votesResults: $votesResults,
			mostVotedOptions: $mostVotedOptions
		})
	);

	return {
		subscribe,
		allVotes
	};
};

export type VotingRoundStore = ReturnType<typeof createVotingRoundStore>;

const createAllVotesStore = (votingRound: VotingRound) => {
	const { subscribe, update } = writable(getVotingRoundVotes(votingRound));

	const addVote = (vote: Vote) => {
		update(async (votesPromise) => {
			const votes = await votesPromise;
			return [...votes, vote];
		});
	};

	return {
		subscribe,
		addVote
	};
};

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

const getVotingRoundVotes = async (votingRound: VotingRound) => {
	return await getVotes(votingRound);
};

const getVotes = async (votingRound: VotingRound) => {
	const { data, error } = await supabase
		.from('votes')
		.select('*')
		.eq('voting_round_id', votingRound.id);

	if (error) {
		console.log(error);
		throw error;
	}

	return data;
};
