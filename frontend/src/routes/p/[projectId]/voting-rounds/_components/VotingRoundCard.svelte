<script lang="ts">
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
	import VotingElegibility from '../[votingRoundId]/_components/voting-widget/VotingElegibility.svelte';
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
	<div class="card-header">
		<h3>{votingRound.name}</h3>
		<VotingElegibility
			votingStauts={$votingRoundStore.votingStatus}
			votingEligibilityPromise={$votingRoundStore.votingElegibility}
		/>
		{#if $votingRoundStore.votingStatus === 'upcoming' || $votingRoundStore.votingStatus === 'active'}
			<VotingRoundTimer
				remainingTime={$votingRoundStore.remainingTime}
				votingStatus={$votingRoundStore.votingStatus}
			/>
		{/if}
		<p>{votingRound.description}</p>
	</div>
	<div class="card-body">
		<div class="row-10">
			{#if votingRound.start_date}
				<div>
					<p class="date-label w-medium xsmall">Start date</p>
					<p class="small">{new Date(votingRound.start_date).toLocaleDateString()}</p>
				</div>
			{/if}
			<div>
				<p class="date-label w-medium xsmall">End date</p>
				<p class="small">
					{votingRound.end_date
						? new Date(votingRound.end_date).toLocaleDateString()
						: 'No end date'}
				</p>
			</div>
		</div>
	</div>
</a>

<style lang="scss">
	.card-primary {
		text-decoration: none;
		color: inherit;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--space-8);
		border-radius: var(--radius-1);

		.card-header {
			display: flex;
			flex-direction: column;
			gap: var(--space-4);

			h3 {
				font-size: var(--font-size-5);
			}
		}

		.date-label {
			color: var(--clr-text-off);
			text-transform: uppercase;
			letter-spacing: 0.03em;
		}
	}
</style>
