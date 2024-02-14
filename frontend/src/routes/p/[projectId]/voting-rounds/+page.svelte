<script lang="ts">
	import Pagination from '$components/atoms/Pagination.svelte';
	import SearchBar from '$components/search-bar/SearchBar.svelte';
	import VotingRoundCard from './_components/VotingRoundCard.svelte';

	export let data;

	let pageStart: number;
	let pageEnd: number;

	let filteredRounds = data.votingRounds;
	let showFinished = false;

	$: currentPageVotingRounds = showFinished
		? filteredRounds.slice(pageStart, pageEnd)
		: filteredRounds
				.filter((round) => new Date(round.end_date) < new Date())
				.slice(pageStart, pageEnd);
</script>

<div class="column-8">
	<div class="row-8 align-center">
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
</style>
