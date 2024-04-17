<script lang="ts">
	import VotingRoundCard from '$lib/features/voting-rounds/components/voting-round-card/VotingRoundCard.svelte';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';

	export let votingRounds: VotingRound[];
	export let daoSigners: string[];
	export let tokenContractAddress: string | null;

	let activeVotingRoundIndex = 0;

	let activeVotingRound = votingRounds[0];
	$: activeVotingRound = votingRounds[activeVotingRoundIndex];
</script>

{#if votingRounds.length > 0 || activeVotingRound}
	<div class="main-wrapper">
		<div class="row-space-between row-6">
			<span class="title">
				<Icon icon="lucide:vote" />
				Voting rounds
			</span>
			<div class="row-4">
				<button on:click={() => activeVotingRoundIndex--} disabled={activeVotingRoundIndex === 0}>
					<Icon icon="tabler:chevron-left" width="1.2em" />
				</button>
				<span class="rounds-number">
					{activeVotingRoundIndex + 1} / {votingRounds.length}
				</span>
				<button
					on:click={() => activeVotingRoundIndex++}
					disabled={activeVotingRoundIndex === votingRounds.length - 1}
				>
					<Icon icon="tabler:chevron-right" width="1.2em" />
				</button>
			</div>
			<a class="header-link row-1 align-center" href={`/p/${$page.params.projectId}/voting-rounds`}>
				See all
				<Icon icon="tabler:arrow-right" />
			</a>
		</div>
		<VotingRoundCard
			votingRound={activeVotingRound}
			showResults={true}
			{daoSigners}
			{tokenContractAddress}
		/>
	</div>
{/if}

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);

		.title {
			font-size: var(--font-size-1);
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: var(--space-1);
		}

		.rounds-number {
			font-size: var(--font-size-0);
			color: var(--clr-text-off);
		}

		button {
			background-color: transparent;
			border: none;
			cursor: pointer;
			color: var(--clr-text-off);

			&:hover {
				color: var(--clr-heading-main);
			}

			&:disabled {
				opacity: 0.5;
				cursor: not-allowed;

				&:hover {
					color: var(--clr-text-off);
				}
			}
		}
	}
</style>
