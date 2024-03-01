<script lang="ts">
	import VotingEligibilityLabel from '$lib/features/voting-rounds/components/voting-widget/VotingEligibilityLabel.svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
	import { createVotingRoundStore } from '$lib/features/voting-rounds/utils/createVotingRoundStore.js';
	import { user } from '$stores/flow/FlowStore';
	import VotingRoundTimer from '$lib/features/voting-rounds/components/voting-widget/VotingRoundTimer.svelte';
	import Icon from '@iconify/svelte';
	import VotingModeLabel from './voting-widget/votingModesCard/atoms/VotingModeLabel.svelte';

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
		{#if votingRound.linked_action_id !== null}
			<VotingModeLabel>
				<Icon icon="tabler:link" />
				Linked Action
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

		.title {
			text-transform: uppercase;
			letter-spacing: 0.09em;
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
</style>
