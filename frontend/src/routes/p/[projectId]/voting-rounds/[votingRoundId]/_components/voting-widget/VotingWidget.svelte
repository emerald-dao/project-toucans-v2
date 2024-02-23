<script lang="ts">
	import { postVote } from './../../../../../../admin/[projectId]/voting/_api/postVote';
	import { page } from '$app/stores';
	import PieChart from '$components/charts/PieChart.svelte';
	import { createVotingRoundStore } from '$lib/features/voting-generator/utils/createVotingRoundStore';
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
	import { user } from '$stores/flow/FlowStore';
	import { onMount } from 'svelte';
	import VotingEligibilityLabel from './VotingEligibilityLabel.svelte';
	import VotingOptionCard from './VotingOptionCard.svelte';
	import VotingWidgetCard from './VotingWidgetCard.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { Button } from '@emerald-dao/component-library';

	export let votingRound: VotingRound;

	let selectedOptionId: number | undefined = undefined;

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
					votingRoundStore.allVotes.addVote({
						selected_option: payload.new?.selected_option,
						nft_uuid: payload.new?.nft_uuid,
						wallet_address: payload.new?.wallet_address,
						voting_round_id: votingRound.id,
						created_at: payload.new?.created_at
					});
				}
			)
			.subscribe();
		return () => supabase.removeChannel(subscription);
	});

	let submittingVote = false;
	const handleSubmitVote = async () => {
		submittingVote = true;
		if (selectedOptionId && $user.addr) {
			await postVote(
				$page.params.projectId,
				$user,
				votingRound,
				selectedOptionId,
				$votingRoundStore.votingStatus,
				'0zxnjfekw'
			);
		}

		submittingVote = false;
	};

	let innerWidth: number;
</script>

<svelte:window bind:innerWidth />
<div class="column-3">
	{#await $votingRoundStore.allVotes then votes}
		<VotingWidgetCard {votingRound} {votingRoundStore}>
			<div class="voting-data-wrapper">
				<div class="column-6">
					<VotingEligibilityLabel
						votingStatus={$votingRoundStore.votingStatus}
						votingEligibilityPromise={$votingRoundStore.votingEligibility}
					/>
					<div class="options-wrapper">
						{#each votingRound.voting_options as option}
							<VotingOptionCard {votingRoundStore} votingOption={option} bind:selectedOptionId />
						{/each}
					</div>
					{#await $votingRoundStore.votingEligibility then votingEligibility}
						{#if votingEligibility.eligible}
							<Button
								width="full-width"
								state={submittingVote ? 'loading' : selectedOptionId ? 'active' : 'disabled'}
								on:click={handleSubmitVote}
							>
								{selectedOptionId ? 'Vote' : 'Select an option to vote'}
							</Button>
						{/if}
					{/await}
				</div>
				{#if innerWidth > 1040}
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
				{/if}
			</div>
		</VotingWidgetCard>
	{/await}
</div>

<style lang="scss">
	.voting-data-wrapper {
		display: grid;
		gap: var(--space-10);
		grid-template-columns: 1fr;

		@include mq('medium') {
			grid-template-columns: 1fr 1fr;
		}

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
