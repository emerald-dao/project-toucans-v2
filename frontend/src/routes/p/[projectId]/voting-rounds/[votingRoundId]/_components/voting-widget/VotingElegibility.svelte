<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { VotingRoundStatus } from './voting-round-status.type';
	import type { VotingEligibility } from '$lib/features/voting-generator/utils/getUserVotingEligibility';

	export let votingStauts: VotingRoundStatus;
	export let votingEligibilityPromise: Promise<VotingEligibility>;
</script>

<div class="main-wrapper">
	<div class="status-label" class:active={votingStauts === 'active'}>
		{#if votingStauts === 'active'}
			<span class="row-1 align-center">
				<Icon icon="tabler:check" />
				Round is active
			</span>
		{:else if votingStauts === 'upcoming'}
			<span class="row-1 align-center">
				<Icon icon="tabler:clock" />
				Round is upcoming
			</span>
		{:else if votingStauts === 'ended'}
			<span class="row-1 align-center">
				<Icon icon="tabler:clock-check" />
				Round has finished
			</span>
		{/if}
	</div>
	{#await votingEligibilityPromise then votingEligibility}
		{#if votingEligibility.eligible}
			<div
				class="elegibility-label"
				class:active={votingEligibility.eligible && votingStauts === 'active'}
				class:upcoming={votingEligibility.eligible && votingStauts === 'upcoming'}
			>
				{#if votingEligibility.eligible}
					<span class="row-1 align-center">
						<Icon icon="tabler:check" />
						You are eligible
					</span>
				{:else}
					<span>You are not eligible</span>
				{/if}
			</div>
		{:else if votingEligibility.reason === ('already-voted' || 'required-nfts-already-used')}
			<div class="elegibility-label">
				<span class="row-1 align-center">
					<Icon icon="tabler:check" />
					You have already voted
				</span>
			</div>
		{/if}
	{/await}
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: row;

		.status-label,
		.elegibility-label {
			color: var(--clr-heading-inverse);
			padding-inline: var(--space-2);
			border-radius: var(--radius-0);
			font-size: var(--font-size-0);
		}

		.status-label {
			background-color: var(--clr-tertiary-badge);
			color: var(--clr-tertiary-main);
			border: 1px solid var(--clr-tertiary-badge);

			&:not(:last-child) {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}

			&.active {
				color: var(--clr-primary-main);
				background-color: var(--clr-primary-badge);
			}
		}

		.elegibility-label {
			background-color: var(--clr-surface-primary);
			color: var(--clr-text-main);
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			padding-left: var(--space-1);
			border-style: solid;
			border-color: var(--clr-neutral-badge);
			border-width: 1px 1px 1px 0;

			&.active {
				background-color: var(--clr-primary-main);
				color: var(--clr-heading-inverse);
			}

			&.upcoming {
				background-color: var(--clr-tertiary-main);
				color: var(--clr-heading-inverse);
			}
		}
	}
</style>
