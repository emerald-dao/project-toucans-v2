<script lang="ts">
	import type { VotingRoundStatus } from './voting-round-status.type';
	import type { VotingEligibility } from '$lib/features/voting-rounds/utils/getUserVotingEligibility';
	import { user } from '$stores/flow/FlowStore';

	export let votingStatus: VotingRoundStatus;
	export let votingEligibilityPromise: Promise<VotingEligibility>;
</script>

<div class="main-wrapper">
	<div class="status-label" class:active={votingStatus === 'active'}>
		{#if votingStatus === 'active'}
			<span class="row-1 align-start"> Active </span>
		{:else if votingStatus === 'upcoming'}
			<span class="row-1 align-start"> Upcoming </span>
		{:else if votingStatus === 'ended'}
			<span class="row-1 align-start"> Finished </span>
		{/if}
	</div>
	{#if votingStatus !== 'ended'}
		{#if $user.addr}
			{#await votingEligibilityPromise then votingEligibility}
				{#if votingEligibility.reason && (votingEligibility.reason === 'already-voted' || votingEligibility.reason === 'required-nfts-already-used')}
					<div class="elegibility-label">
						<span> Already voted </span>
					</div>
				{:else}
					<div
						class="elegibility-label"
						class:active={votingEligibility.eligible && votingStatus === 'active'}
						class:upcoming={votingEligibility.eligible && votingStatus === 'upcoming'}
					>
						{#if votingEligibility.eligible}
							<span> Eligible </span>
						{:else}
							<span> Not eligible </span>
						{/if}
					</div>
				{/if}
			{/await}
		{:else}
			<div class="elegibility-label">
				<span> Connect wallet </span>
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: row;
		line-height: 1.2;

		.status-label,
		.elegibility-label {
			color: var(--clr-heading-inverse);
			border-radius: var(--radius-0);
			font-size: var(--font-size-0);
			padding: 0.4em 1em;
		}

		.status-label {
			background-color: var(--clr-tertiary-badge);
			color: var(--clr-tertiary-main);

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
			background-color: var(--clr-surface-secondary);
			color: var(--clr-text-main);
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;

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
