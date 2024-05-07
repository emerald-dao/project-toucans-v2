<script lang="ts">
	import VotingResultsPieChart from '../voting-results-charts/VotingResultsPieChart.svelte';
	import { page } from '$app/stores';
	import { createVotingRoundStore } from '$lib/features/voting-rounds/utils/createVotingRoundStore';
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
	import { user } from '$stores/flow/FlowStore';
	import { onMount } from 'svelte';
	import VotingOptionCard from './VotingOptionCard.svelte';
	import VotingWidgetCard from './VotingWidgetExpandedCard.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { Button } from '@emerald-dao/component-library';
	import { postVote } from '$lib/features/voting-rounds/api/postVote';
	import type { ActionData } from '$lib/types/dao-project/dao-project.interface';

	export let votingRound: VotingRound;
	export let daoActions: ActionData[];
	export let tokenContractAddress: string | null;
	export let completedActionIds: {[actionId: string]: boolean};

	let selectedOptionId: number | undefined = undefined;

	let votingRoundStore = createVotingRoundStore(
		votingRound,
		$user.addr ?? null,
		tokenContractAddress
	);

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
						id: Number(payload.new?.id),
						selected_option: Number(payload.new?.selected_option),
						nft_uuids: payload.new.nft_uuids ?? null,
						wallet_address: payload.new?.wallet_address as string,
						voting_round_id: Number(votingRound.id),
						created_at: payload.new?.created_at as string,
						amount_of_tokens: payload.new.amount_of_tokens
							? Number(payload.new.amount_of_tokens)
							: null
					});
				}
			)
			.subscribe();

		return () => supabase.removeChannel(subscription);
	});

	let submittingVote = false;
	const handleSubmitVote = async () => {
		const votingEligibility = await $votingRoundStore.votingEligibility;

		submittingVote = true;
		if (selectedOptionId && $user.addr) {
			await postVote(
				$page.params.projectId,
				$user,
				votingRound,
				selectedOptionId,
				$votingRoundStore.votingStatus,
				votingEligibility.availableNfts,
				votingEligibility.availableTokens,
				tokenContractAddress
			);
		}

		selectedOptionId = undefined;
		submittingVote = false;
	};

	let innerWidth: number;
</script>

<svelte:window bind:innerWidth />
<div class="column-3 main-wrapper">
	<VotingWidgetCard {votingRound} {votingRoundStore} {daoActions} {completedActionIds}>
		<div class="voting-data-wrapper">
			<div class="column-6">
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
				<VotingResultsPieChart
					{votingRoundStore}
					votingRoundName={votingRound.name}
					votingOptions={votingRound.voting_options}
				/>
			{/if}
		</div>
	</VotingWidgetCard>
</div>

<style lang="scss">
	.main-wrapper {
		flex: 1;

		.voting-data-wrapper {
			display: grid;
			gap: var(--space-10);
			grid-template-columns: 1fr;
			height: 100%;

			@include mq('medium') {
				grid-template-columns: 1fr 1fr;
			}

			.options-wrapper {
				display: flex;
				flex-direction: column;
				gap: var(--space-4);
			}
		}
	}
</style>
