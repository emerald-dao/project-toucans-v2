<script lang="ts">
	import LinkedActionModeCard from './votingModesCard/LinkedActionModeCard.svelte';
	import NFTModeCard from './votingModesCard/NFTModeCard.svelte';
	import type { VotingRoundStore } from '$lib/features/voting-rounds/utils/createVotingRoundStore';
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
	import VotingEligibilityLabel from './VotingEligibilityLabel.svelte';
	import VotingRoundTimer from './VotingRoundTimer.svelte';
	import type { ActionData } from '$lib/types/dao-project/dao-project.interface';

	export let votingRound: VotingRound;
	export let votingRoundStore: VotingRoundStore;
	export let daoActions: ActionData[];
	export let completedActionIds: {[actionId: string]: boolean}
</script>

<div class="card">
	<div class="voting-round-data-wrapper">
		<div class="column-7">
			<div class="column-3">
				<h4 class="w-medium">
					{votingRound.name}
				</h4>
				<VotingEligibilityLabel
					votingStatus={$votingRoundStore.votingStatus}
					votingEligibilityPromise={$votingRoundStore.votingEligibility}
				/>
				{#if votingRound.description}
					<p class="small">{votingRound.description}</p>
				{/if}
			</div>
			{#if ($votingRoundStore.votingStatus === 'active' || $votingRoundStore.votingStatus === 'upcoming') && $votingRoundStore.remainingTime}
				<VotingRoundTimer
					remainingTime={$votingRoundStore.remainingTime}
					votingStatus={$votingRoundStore.votingStatus}
				/>
			{/if}
			<div class="column-3">
				<NFTModeCard
					nftMode={votingRound.nft_mode}
					requiredCollectionId={votingRound.required_nft_collection_id}
				/>
				{#if votingRound.linked_action_id}
					<LinkedActionModeCard linkedActionId={votingRound.linked_action_id} {daoActions} {completedActionIds} linkedActionType={votingRound.linked_action_type} />
				{/if}
			</div>
		</div>
	</div>
	<div class="voting-round-results-wrapper">
		<slot />
	</div>
</div>

<style lang="scss">
	.card {
		display: grid;
		grid-template-columns: 1fr;
		padding: 0;
		overflow: hidden;
		border-radius: var(--radius-4);

		@include mq('medium') {
			grid-template-columns: 1fr 2fr;
		}

		.voting-round-data-wrapper {
			background-color: var(--clr-background-secondary);
			border-right: 0.5px solid var(--clr-border-primary);
		}

		.voting-round-results-wrapper,
		.voting-round-data-wrapper {
			padding: var(--space-7);

			@include mq('medium') {
				padding: var(--space-9);
			}
		}
	}
</style>
