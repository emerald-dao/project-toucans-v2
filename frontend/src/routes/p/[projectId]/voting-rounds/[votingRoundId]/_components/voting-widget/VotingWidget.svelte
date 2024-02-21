<script lang="ts">
	import PieChart from '$components/charts/PieChart.svelte';
	import { createVotingRoundStore } from '$lib/features/voting-generator/utils/createVotingRoundStore';
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
	import { user } from '$stores/flow/FlowStore';
	import { onMount } from 'svelte';
	import VotingElegibility from './VotingElegibility.svelte';
	import VotingOptionCard from './VotingOptionCard.svelte';
	import VotingWidgetCard from './VotingWidgetCard.svelte';
	import { supabase } from '$lib/supabaseClient';

	export let votingRound: VotingRound;

	let selectedOption: number | undefined = undefined;

	let votingRoundStore = createVotingRoundStore(votingRound, $user.addr ?? null);
	$: votingRoundStore = createVotingRoundStore(votingRound, $user.addr ?? null);

	onMount(() => {
		const subscription = supabase
			.channel('votes')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'votes',
					filter: `voting_round_id=eq.${votingRound.id}`
				},
				async (payload) => {
					const selectedOption = payload.new?.selected_option;
					const nftUuid = payload.new?.nft_uuid;
					const walletAddress = payload.new?.wallet_address;

					votingRoundStore.allVotes.addVote({
						selected_option: selectedOption,
						nft_uuid: nftUuid,
						wallet_address: walletAddress
					});
				}
			)
			.subscribe();
		return () => supabase.removeChannel(subscription);
	});

	$: isUserEligible = true;
	// $: userHasVoted = false;

	let userVotedOption = 1;
</script>

<div class="column-3">
	{#await $votingRoundStore.allVotes then votes}
		<VotingWidgetCard {votingRound} votingRoundStore={$votingRoundStore}>
			<div class="voting-data-wrapper">
				<div class="options-wrapper">
					<VotingElegibility
						votingStatus={$votingRoundStore.votingStatus}
						votingEligibilityPromise={$votingRoundStore.votingElegibility}
					/>
					{#await $votingRoundStore.votesResults then results}
						{#await $votingRoundStore.allVotes then votes}
							{#await $votingRoundStore.mostVotedOptions then mostVotedOptions}
								{#each votingRound.voting_options as option}
									<VotingOptionCard
										votingOption={option}
										votesPercentage={((results[option.id] / votes.length) * 100).toFixed(2) + '%'}
										bind:selectedOption
										{isUserEligible}
										votingRoundStatus={$votingRoundStore.votingStatus}
										{mostVotedOptions}
										{userVotedOption}
										amountOfVotes={results[option.id]}
									/>
								{/each}
							{/await}
						{/await}
					{/await}
				</div>
				<div class="chart-wrapper">
					{#if $votingRoundStore.votingStatus === 'upcoming'}
						<em class="text-small">Chart will be available once the round starts</em>
					{:else if votes.length === 0}
						<em class="text-small">No votes yet</em>
					{:else}
						{#await $votingRoundStore.votesResults then results}
							{@const options = Object.keys(results)}
							{@const totalVotes = Object.values(results)}
							<PieChart title={votingRound.name} chartData={totalVotes} labels={options} />
						{/await}
					{/if}
				</div>
			</div>
		</VotingWidgetCard>
	{/await}
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
