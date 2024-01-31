import { derived, writable } from 'svelte/store';
import type { VotingOption } from './2-voting-options/voting-option.interface';
import type { VotingModeSlugs } from './3-nft-mode/votingModes';

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

export const votingGeneratorNftMode = createVotingGeneratorDataStore<VotingModeSlugs>('no-nfts');

export const votingGeneratorDates = createVotingGeneratorDataStore({
	hasTimeframe: false,
	startDate: new Date(),
	endDate: new Date()
});

export const votingGeneratorDatra = derived(
	[
		votingGeneratorGeneralData,
		votingGeneratorOptions,
		votingGeneratorNftMode,
		votingGeneratorDates
	],
	([
		$votingGeneratorGeneralData,
		$votingGeneratorOptions,
		$votingGeneratorNftMode,
		$votingGeneratorDates
	]) => {
		return {
			...$votingGeneratorGeneralData,
			options: $votingGeneratorOptions,
			mode: $votingGeneratorNftMode,
			...$votingGeneratorDates
		};
	}
);

export const resetVotingGeneratorStores = () => {
	votingGeneratorGeneralData.reset();
	votingGeneratorOptions.reset();
	votingGeneratorNftMode.reset();
	votingGeneratorDates.reset();
};
