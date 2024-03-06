<script lang="ts">
	import VotingOptionsListElement from './../../2-voting-options/components/VotingOptionsListElement.svelte';
	import type { VotingOption } from '$lib/features/voting-rounds/types/voting-option.interface';
	import Pagination from '$components/atoms/Pagination.svelte';
	import type { SuiteResult } from 'vest';

	export let votingOptions: VotingOption[];

	export let pageStart: number;
	export let pageEnd: number;
	export let pageSize = 4;

	export let validationRes: SuiteResult;

	$: currentPageVotingOptions = votingOptions.slice(pageStart, pageEnd);

	const handleDeleteOption = (event: CustomEvent<{ id: string }>) => {
		votingOptions = votingOptions.filter((option) => option.id !== event.detail.id);
	};
</script>

<div class="main-wrapper">
	<div class="items-wrapper">
		{#each currentPageVotingOptions as votingOption, i (votingOption.id)}
			<VotingOptionsListElement
				{votingOption}
				optionNumber={i + 1 + (pageStart > 0 ? pageStart : 0)}
				on:input
				on:delete={handleDeleteOption}
				{validationRes}
			/>
		{/each}
	</div>
	<Pagination amountOfItems={votingOptions.length} bind:pageStart bind:pageEnd {pageSize} />
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: var(--space-3);
		padding: var(--space-5);
		border-radius: var(--radius-3);
		border: 1px solid var(--clr-border-primary);
		background-color: var(--clr-background-primary);

		.items-wrapper {
			display: grid;
			gap: var(--space-3);
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(2, auto);
		}
	}
</style>
