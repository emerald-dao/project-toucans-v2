<script lang="ts">
	import PieChart from '$components/charts/PieChart.svelte';
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
	import { fetchVotingRoundVotes } from '$lib/utilities/api/supabase/fetchVotingRoundVotes';
	import VotingElegibility from './VotingElegibility.svelte';
	import VotingOptionCard from './VotingOptionCard.svelte';
	import VotingWidgetCard from './VotingWidgetCard.svelte';
	import { getVotingRoundStatus } from './getVotingRoundStatus';

	export let votingRound: VotingRound;

	$: activeRoundVotes = fetchVotingRoundVotes(votingRound.id);

	let selectedOption: number | undefined = undefined;

	$: activeRoundStatus = getVotingRoundStatus(
		new Date(votingRound.start_date),
		votingRound.end_date ? new Date(votingRound.end_date) : undefined
	);
	$: isUserEligible = true;
	$: userHasVoted = false;

	let userVotedOption = 1;
</script>

<div class="column-3">
	<VotingWidgetCard {votingRound} {activeRoundStatus}>
		{#await activeRoundVotes}
			<em>Loading options...</em>
		{:then votes}
			{@const totalAmountOfVotes = votes.reduce((acc, vote) => acc + vote.votes.length, 0)}
			{@const mostVotedOptions = votes
				.filter((vote) => vote.votes.length === Math.max(...votes.map((vote) => vote.votes.length)))
				.map((vote) => vote.option_number)}
			<div class="voting-data-wrapper">
				<div class="options-wrapper">
					<VotingElegibility {isUserEligible} {userHasVoted} votingStauts={activeRoundStatus} />
					{#each votes as vote}
						<VotingOptionCard
							votingOption={vote}
							votesPercentage={((vote.votes.length / totalAmountOfVotes) * 100).toFixed(2) + '%'}
							bind:selectedOption
							{isUserEligible}
							votingRoundStatus={activeRoundStatus}
							{mostVotedOptions}
							{userVotedOption}
						/>
					{/each}
				</div>
				<div class="chart-wrapper">
					{#if activeRoundStatus === 'upcoming'}
						<em class="text-small">Chart will be available once the round starts</em>
					{:else if totalAmountOfVotes === 0}
						<em class="text-small">No votes yet</em>
					{:else}
						<PieChart
							title={votingRound.name}
							chartData={votes.map((vote) => vote.votes.length)}
							labels={votes.map((vote) => vote.name)}
						/>
					{/if}
				</div>
			</div>
		{/await}
	</VotingWidgetCard>
</div>

<style lang="scss">
	.voting-data-wrapper {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-10);

		.options-wrapper {
			display: flex;
			flex-direction: column;
			gap: var(--space-4);
		}

		.chart-wrapper {
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
		}
	}

	em {
		color: var(--clr-text-off);
	}
</style>
