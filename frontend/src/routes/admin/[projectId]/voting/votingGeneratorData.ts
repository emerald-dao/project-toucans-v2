import { derived, writable } from 'svelte/store';
import type { VotingOption } from './_components/steps/2-voting-options/voting-option.interface';
import type { VotingNftModeSlugs } from './_components/steps/3-nft-mode/votingNftModes';

const createVotingGeneratorDataStore = <T>(defaultData: T) => {
	const { subscribe, set, update } = writable(defaultData);

	const reset = () => {
		set(defaultData);
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
		title: '',
		description: ''
	});

type VotingGeneratorGeneralData = {
	title: string;
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

export const votingGeneratorNftMode = createVotingGeneratorDataStore<VotingNftModeSlugs>('no-nfts');
export const votingGeneratorRequiredCollection = createVotingGeneratorDataStore<[string]>(['']);

export const votingGeneratorDates = createVotingGeneratorDataStore({
	hasTimeframe: false,
	startDate: new Date(),
	endDate: new Date()
});

export const votingGeneratorData = derived(
	[
		votingGeneratorGeneralData,
		votingGeneratorOptions,
		votingGeneratorNftMode,
		votingGeneratorRequiredCollection,
		votingGeneratorDates
	],
	([
		$votingGeneratorGeneralData,
		$votingGeneratorOptions,
		$votingGeneratorNftMode,
		$votingGeneratorRequiredCollection,
		$votingGeneratorDates
	]) => {
		return {
			...$votingGeneratorGeneralData,
			options: $votingGeneratorOptions,
			mode: $votingGeneratorNftMode,
			requiredCollection: $votingGeneratorRequiredCollection,
			...$votingGeneratorDates
		};
	}
);

export const resetVotingGeneratorStores = () => {
	votingGeneratorGeneralData.reset();
	votingGeneratorOptions.reset();
	votingGeneratorNftMode.reset();
	votingGeneratorRequiredCollection.reset();
	votingGeneratorDates.reset();
};
