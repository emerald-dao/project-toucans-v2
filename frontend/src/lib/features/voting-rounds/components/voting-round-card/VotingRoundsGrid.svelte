<script lang="ts">
	import Pagination from '$components/atoms/Pagination.svelte';
	import SearchBar from '$components/search-bar/SearchBar.svelte';
	import { postgreTimestampToDateTime } from '$lib/features/voting-rounds/utils/postgreTimestampToDateTime';
	import { getLocalTimeZone, now } from '@internationalized/date';
	import VotingRoundCard from '$lib/features/voting-rounds/components/voting-round-card/VotingRoundCard.svelte';
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';

	export let votingRounds: VotingRound[];
	export let cardsPerPage = 9;
	export let daoSigners: string[];
	export let showDeleteButton = false;
	export let tokenContractAddress: string | null;

	let showFinished = false;

	const hideFinishedRounds = (rounds: VotingRound[]) => {
		return rounds.filter(
			(round) => postgreTimestampToDateTime(round.end_date).compare(now(getLocalTimeZone())) > 0
		);
	};

	$: firstFilteredRounds = showFinished ? votingRounds : hideFinishedRounds(votingRounds);

	let filteredRounds: VotingRound[] = [];

	let pageStart: number;
	let pageEnd: number;

	$: currentPageVotingRounds = filteredRounds ? filteredRounds.slice(pageStart, pageEnd) : [];
</script>

<div class="main-wrapper column-8">
	<div class="content-wrapper column-8">
		<div class="search-wrapper">
			<SearchBar
				items={firstFilteredRounds}
				bind:filteredItems={filteredRounds}
				searchTerms={['name']}
				placeholder="Search votes..."
			/>
			<label for="show-finished" class="switch">
				<input
					type="checkbox"
					name="show-finished"
					id="show-finished"
					bind:checked={showFinished}
				/>
				<span class="slider" />
				Show finished
			</label>
		</div>
		<div class="cards-wrapper">
			{#if currentPageVotingRounds.length > 0}
				{#each currentPageVotingRounds as round (round.id)}
					<VotingRoundCard
						votingRound={round}
						{daoSigners}
						{showDeleteButton}
						{tokenContractAddress}
					/>
				{/each}
			{:else}
				<em>No voting rounds available</em>
			{/if}
		</div>
	</div>
	<Pagination
		amountOfItems={filteredRounds.length}
		bind:pageStart
		bind:pageEnd
		pageSize={cardsPerPage}
	/>
</div>

<style lang="scss">
	.main-wrapper {
		flex: 1;

		.content-wrapper {
			flex: 1;

			.cards-wrapper {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
		}
	}
</style>
