<script lang="ts">
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
	import VotingEligibilityLabel from '../[votingRoundId]/_components/voting-widget/VotingEligibilityLabel.svelte';
	import { createVotingRoundStore } from '$lib/features/voting-generator/utils/createVotingRoundStore.js';
	import { user } from '$stores/flow/FlowStore';
	import VotingRoundTimer from '../[votingRoundId]/_components/voting-widget/VotingRoundTimer.svelte';

	export let votingRound: VotingRound;

	const votingRoundStore = createVotingRoundStore(votingRound, $user.addr ?? null);
</script>

<a
	href={`/p/${$page.params.projectId}/voting-rounds/${votingRound.id}`}
	class="card-primary"
	in:fly={{ y: 20, duration: 100 }}
>
	<h3>{votingRound.name}</h3>
	<VotingEligibilityLabel
		votingStatus={$votingRoundStore.votingStatus}
		votingEligibilityPromise={$votingRoundStore.votingEligibility}
	/>
	{#if votingRound.description}
		<p class="small">{votingRound.description}</p>
	{/if}
	{#if $votingRoundStore.votingStatus === 'upcoming' || $votingRoundStore.votingStatus === 'active'}
		<VotingRoundTimer
			remainingTime={$votingRoundStore.remainingTime}
			votingStatus={$votingRoundStore.votingStatus}
		/>
	{/if}
</a>

<style lang="scss">
	.card-primary {
		text-decoration: none;
		color: inherit;
		display: flex;
		border-radius: var(--radius-1);
		flex-direction: column;
		gap: var(--space-5);
		padding: var(--space-5);

		@include mq('medium') {
			padding: var(--space-7);
		}

		h3 {
			font-size: var(--font-size-4);

			@include mq('medium') {
				font-size: var(--font-size-5);
			}
		}
	}
</style>
