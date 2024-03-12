<script lang="ts">
	import { Button } from '@emerald-dao/component-library';
	import VotingOptionsList from './components/VotingOptionsList.svelte';
	import Icon from '@iconify/svelte';
	import validationSuite from './validation';
	import { onMount } from 'svelte';
	import { votingGeneratorOptions } from '../../../_config/votingGeneratorData';

	export let isValid = false;

	onMount(() => {
		handleChange();
	});

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

	const handleChange = () => {
		// Workaround to solve unsync reactivness.
		// If we take away the timeout, the validation runs before values change
		setTimeout(() => {
			res = validationSuite($votingGeneratorOptions).done((r) => {
				isValid = r.isValid();
			});
		}, 1);
	};

	let res = validationSuite.get();

	let pageStart: number;
	let pageEnd: number;
	let pageSize: number;
</script>

<div class="column-5 align-end">
	<VotingOptionsList
		bind:votingOptions={$votingGeneratorOptions}
		bind:pageStart
		bind:pageEnd
		bind:pageSize
		on:input={handleChange}
		validationRes={res}
	/>
	<Button color="neutral" type="ghost" size="x-small" on:click={handleAddNewOption}>
		<Icon icon="tabler:plus" />
		Add voting option
	</Button>
</div>
