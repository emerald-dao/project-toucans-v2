import { writable } from 'svelte/store';
import type { VotingOption } from './2-voting-options/voting-option.interface';

export const votingGeneratorData = writable<VotingGeneratorData>({
	title: '',
	description: ''
});

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

type VotingGeneratorData = {
	title: string;
	description: string;
};
