import { derived, writable, type Readable } from 'svelte/store';
import type { VotingOption } from './_components/steps/2-voting-options/voting-option.interface';
import type { VotingNftModeSlug } from './_components/steps/3-nft-mode/votingNftModes';
import type { VotingRoundData } from './_types/voting-round-data.type';
import { fromDate, getLocalTimeZone, now, toCalendarDateTime } from '@internationalized/date';

const createVotingGeneratorDataStore = <T>(defaultData: T) => {
	const { subscribe, set, update } = writable(structuredClone(defaultData));

	const reset = () => {
		set(structuredClone(defaultData));
	};

	return {
		subscribe,
		set,
		update,
		reset
	};
};

export const votingGeneratorGeneralData =
	createVotingGeneratorDataStore<VotingGeneratorGeneralData>({
		name: '',
		description: ''
	});

export type VotingGeneratorGeneralData = {
	name: string;
	description: string;
};

export const votingGeneratorOptions = createVotingGeneratorDataStore<VotingOption[]>([
	{
		name: 'Yes',
		description: '',
		id: '1'
	},
	{
		name: 'No',
		description: '',
		id: '2'
	}
]);

export const votingGeneratorNftMode = createVotingGeneratorDataStore<VotingNftModeSlug>('no-nfts');
export const votingGeneratorRequiredCollection = createVotingGeneratorDataStore<[string]>(['']);

export const votingGeneratorDates = createVotingGeneratorDataStore<VotingGeneratorDates>({
	startDate: undefined,
	endDate: toCalendarDateTime(now(getLocalTimeZone()).add({ weeks: 1 }))
		.set({ second: 0, millisecond: 0 })
		.toString()
});

export type VotingGeneratorDates = {
	startDate?: string;
	endDate: string;
};

export const votingGeneratorDatesWithTimezone = derived(
	votingGeneratorDates,
	($votingGeneratorDates) => {
		return {
			startDate: $votingGeneratorDates.startDate
				? fromDate(new Date($votingGeneratorDates.startDate), getLocalTimeZone()).toAbsoluteString()
				: undefined,
			endDate: fromDate(
				new Date($votingGeneratorDates.endDate),
				getLocalTimeZone()
			).toAbsoluteString()
		};
	}
);

export const votingGeneratorLinkedAction = createVotingGeneratorDataStore<null | string>(null);

const OPTIONS_IF_LINKED_ACTION = [
	{
		name: 'Action should be approved',
		description: '',
		id: '1'
	},
	{
		name: 'Action should be disapproved',
		description: '',
		id: '2'
	}
];

export const votingGeneratorData: Readable<VotingRoundData> = derived(
	[
		votingGeneratorGeneralData,
		votingGeneratorOptions,
		votingGeneratorNftMode,
		votingGeneratorRequiredCollection,
		votingGeneratorDatesWithTimezone,
		votingGeneratorLinkedAction
	],
	([
		$votingGeneratorGeneralData,
		$votingGeneratorOptions,
		$votingGeneratorNftMode,
		$votingGeneratorRequiredCollection,
		$votingGeneratorDatesWithTimeZone,
		$votingGeneratorLinkedAction
	]) => {
		return {
			...$votingGeneratorGeneralData,
			options:
				$votingGeneratorLinkedAction !== null ? OPTIONS_IF_LINKED_ACTION : $votingGeneratorOptions,
			nftMode: $votingGeneratorNftMode,
			requiredCollection: $votingGeneratorRequiredCollection,
			...$votingGeneratorDatesWithTimeZone,
			linkedAction: $votingGeneratorLinkedAction
		};
	}
);

export const resetVotingGeneratorStores = () => {
	votingGeneratorGeneralData.reset();
	votingGeneratorOptions.reset();
	votingGeneratorNftMode.reset();
	votingGeneratorRequiredCollection.reset();
	votingGeneratorDates.reset();
	votingGeneratorLinkedAction.reset();
};
