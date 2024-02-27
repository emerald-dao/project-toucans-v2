<script lang="ts">
	import VotingEligibilityLabel from '$lib/features/voting/components/voting-widget/VotingEligibilityLabel.svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
	import { createVotingRoundStore } from '$lib/features/voting/utils/createVotingRoundStore.js';
	import { user } from '$stores/flow/FlowStore';
	import VotingRoundTimer from '$lib/features/voting/components/voting-widget/VotingRoundTimer.svelte';

	export let votingRound: VotingRound;

	const votingRoundStore = createVotingRoundStore(votingRound, $user.addr ?? null);
</script>

<a
	href={`/p/${$page.params.projectId}/voting-rounds/${votingRound.id}`}
	class="card-primary"
	in:fly={{ y: 20, duration: 100 }}
>
	<div class="card-content">
		<h3>{votingRound.name}</h3>
		<VotingEligibilityLabel
			votingStatus={$votingRoundStore.votingStatus}
			votingEligibilityPromise={$votingRoundStore.votingEligibility}
		/>
		<div class="description-wrapper">
			{#if votingRound.description}
				<p class="small">{votingRound.description}</p>
			{/if}
		</div>
	</div>
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
		justify-content: space-between;

		@include mq('medium') {
			padding: var(--space-7);
		}

		.card-content {
			display: flex;
			flex-direction: column;
			gap: var(--space-3);

			h3 {
				font-size: var(--font-size-4);

				@include mq('medium') {
					font-size: var(--font-size-5);
				}
			}

			.description-wrapper {
				height: 3rem;

				p {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
</style>
