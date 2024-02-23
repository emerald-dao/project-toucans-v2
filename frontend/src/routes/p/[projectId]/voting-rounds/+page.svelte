<script lang="ts">
	import { include } from 'vest';
	import Pagination from '$components/atoms/Pagination.svelte';
	import SearchBar from '$components/search-bar/SearchBar.svelte';
	import { postgreTimestampToDateTime } from '$lib/features/voting-generator/utils/postgreTimestampToDateTime';
	import { getLocalTimeZone, now } from '@internationalized/date';
	import VotingRoundCard from './_components/VotingRoundCard.svelte';

	export let data;

	let pageStart: number;
	let pageEnd: number;

	let filteredRounds = data.votingRounds;
	let showFinished = false;

	$: currentPageVotingRounds = showFinished
		? filteredRounds.slice(pageStart, pageEnd)
		: filteredRounds
				.filter(
					(round) => postgreTimestampToDateTime(round.end_date).compare(now(getLocalTimeZone())) > 0
				)
				.slice(pageStart, pageEnd);
</script>

<div class="column-8">
	<div class="search-wrapper">
		<SearchBar
			items={data.votingRounds}
			bind:filteredItems={filteredRounds}
			searchTerms={['name', 'project_id']}
			placeholder="Search collections..."
		/>
		<label for="show-finished" class="switch">
			<input type="checkbox" name="show-finished" id="show-finished" bind:checked={showFinished} />
			<span class="slider" />
			Show finished
		</label>
	</div>
	<div class="main-wrapper">
		{#if currentPageVotingRounds.length > 0}
			{#each currentPageVotingRounds as round (round.id)}
				<VotingRoundCard votingRound={round} />
			{/each}
		{:else}
			<em>No voting rounds available</em>
		{/if}
	</div>
	<Pagination amountOfItems={filteredRounds.length} bind:pageStart bind:pageEnd pageSize={9} />
</div>

<style lang="scss">
	.main-wrapper {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--space-8);
	}

	.search-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		align-items: flex-start;

		@include mq('medium') {
			flex-direction: row;
			gap: var(--space-6);
			align-items: center;
		}
	}
</style>
