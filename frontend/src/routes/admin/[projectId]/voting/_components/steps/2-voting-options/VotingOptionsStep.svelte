<script lang="ts">
	import { Button } from '@emerald-dao/component-library';
	import { votingGeneratorOptions } from '../../../votingGeneratorData';
	import VotingOptionsList from './components/VotingOptionsList.svelte';
	import Icon from '@iconify/svelte';

	const handleAddNewOption = () => {
		votingGeneratorOptions.update((options) => [
			...options,
			{
				name: '',
				description: '',
				id: Math.random().toString()
			}
		]);

		if ($votingGeneratorOptions.length > pageEnd) {
			pageEnd = Math.ceil($votingGeneratorOptions.length / pageSize) * 4;
			pageStart = pageEnd - pageSize;
		}
	};

	let pageStart: number;
	let pageEnd: number;
	let pageSize: number;
</script>

<div class="column-5">
	<VotingOptionsList
		votingOptions={votingGeneratorOptions}
		bind:pageStart
		bind:pageEnd
		bind:pageSize
	/>
	<Button color="neutral" type="ghost" size="x-small" on:click={handleAddNewOption}>
		<Icon icon="tabler:plus" />
		Add option
	</Button>
</div>
