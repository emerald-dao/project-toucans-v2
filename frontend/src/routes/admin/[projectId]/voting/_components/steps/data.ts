import { writable } from 'svelte/store';
import type { VotingOption } from './2-voting-options/voting-option.interface';
import type { VotingModeSlugs } from './3-nft-mode/votingModes';

export const votingGeneratorData = writable<VotingGeneratorData>({
	title: '',
	description: ''
});

type VotingGeneratorData = {
	title: string;
	description: string;
};

export const votingGeneratorOptions = writable<VotingOption[]>([
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

export const votingGeneratorNftMode = writable<VotingModeSlugs>('no-nfts');
