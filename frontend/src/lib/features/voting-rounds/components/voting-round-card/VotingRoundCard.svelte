<script lang="ts">
	import VotingEligibilityLabel from '$lib/features/voting-rounds/components/voting-widget/VotingEligibilityLabel.svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
	import { createVotingRoundStore } from '$lib/features/voting-rounds/utils/createVotingRoundStore.js';
	import { user } from '$stores/flow/FlowStore';
	import VotingRoundTimer from '$lib/features/voting-rounds/components/voting-widget/VotingRoundTimer.svelte';
	import Icon from '@iconify/svelte';
	import VotingModeLabel from '../voting-widget/votingModesCard/atoms/VotingModeLabel.svelte';
	import VotingResultsPieChart from '../voting-results-charts/VotingResultsPieChart.svelte';
	import DeleteVotingRoundModal from './DeleteVotingRoundModal.svelte';

	export let votingRound: VotingRound;
	export let showResults = false;
	export let daoSigners: string[] = [];
	export let showDeleteButton = false;
	export let tokenContractAddress: string | null;

	$: votingRoundStore = createVotingRoundStore(
		votingRound,
		$user.addr ?? null,
		tokenContractAddress
	);
</script>

<a
	href={`/p/${$page.params.projectId}/voting-rounds/${votingRound.id}`}
	class="card-primary"
	class:grid-auto-fill={showResults}
	in:fly={{ y: 20, duration: 100 }}
>
	<div class="card-content">
		{#if showDeleteButton}
			<DeleteVotingRoundModal
				votingRoundId={votingRound.id}
				projectId={votingRound.project_id}
				{daoSigners}
			/>
		{/if}
		<div class="general-data">
			<h3>{votingRound.name}</h3>
			<VotingEligibilityLabel
				votingStatus={$votingRoundStore.votingStatus}
				votingEligibilityPromise={$votingRoundStore.votingEligibility}
			/>
			{#if votingRound.linked_action_id !== null && votingRound.linked_action_type !== null}
				<VotingModeLabel>
					<Icon icon="tabler:link" />
					{`Linked ${votingRound.linked_action_type} Action`}
				</VotingModeLabel>
			{/if}
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
		{:else}
			{#await $votingRoundStore.mostVotedOptions then mostVotedOptions}
				<div class="column-2">
					<span class="xsmall w-medium title">
						{mostVotedOptions.length === 1 ? 'Winner' : 'Winners'}
					</span>
					<div class="winners-cards-wrapper row-3">
						{#each mostVotedOptions as mostVotedOption}
							{@const mostVotedOptionData = votingRound.voting_options.find(
								(option) => option.id === Number(mostVotedOption)
							)}
							{#if mostVotedOptionData}
								<div class="card winner-card">
									<Icon icon="tabler:trophy" color="var(--clr-primary-main)" />
									<span>
										{mostVotedOptionData.name}
									</span>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			{/await}
		{/if}
	</div>
	{#if showResults && $votingRoundStore.votingStatus !== 'upcoming'}
		<div class="card-footer">
			<span class="xsmall w-medium title">Results</span>
			<VotingResultsPieChart
				{votingRoundStore}
				votingRoundName={votingRound.name}
				votingOptions={votingRound.voting_options}
			/>
		</div>
	{/if}
</a>

<style lang="scss">
	.card-primary {
		text-decoration: none;
		border-radius: var(--radius-4);
		justify-content: space-between;
		padding: 0;
		overflow: hidden;
		background-color: var(--clr-background-secondary);

		&:hover {
			filter: brightness(1.3);
		}

		&.grid-auto-fill {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		}

		.card-content {
			display: flex;
			flex-direction: column;
			position: relative;
			gap: var(--space-10);
			justify-content: space-between;
			background-color: var(--clr-surface-primary);
			height: 100%;

			.general-data {
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

			.winners-cards-wrapper {
				flex-wrap: wrap;

				.winner-card {
					display: flex;
					flex-direction: row;
					align-items: center;
					gap: var(--space-1);
					padding: var(--space-2);
					border-radius: var(--radius-0);
					background-color: var(--clr-surface-secondary);

					span {
						line-height: 1;
						font-size: var(--font-size-1);
						color: var(--clr-heading-main);
					}
				}
			}
		}

		.card-footer {
			min-height: 350px;
			height: 100%;
		}

		.card-content,
		.card-footer {
			padding: var(--space-5);

			@include mq('medium') {
				padding: var(--space-7);
			}
		}
	}

	.title {
		text-transform: uppercase;
		letter-spacing: 0.09em;
	}
</style>
