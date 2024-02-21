<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { VotingRoundStatus } from './voting-round-status.type';
	import type { VotingOption } from '$lib/utilities/api/supabase/fetchAllVotingRounds';

	export let votingOption: VotingOption;
	export let votesPercentage: string;
	export let selectedOption: number | undefined;
	export let isUserEligible: boolean;
	export let votingRoundStatus: VotingRoundStatus;
	export let mostVotedOptions: string[];
	export let userVotedOption: number;
	export let amountOfVotes: number;

	$: votingEnabled =
		votingRoundStatus === 'active' && isUserEligible && userVotedOption === undefined;

	const handleSelectOption = () => {
		if (!votingEnabled) return;

		selectedOption = votingOption.option_number;
	};

	$: isSelected = selectedOption === votingOption.option_number;
	$: isWinner =
		mostVotedOptions.includes(votingOption.id.toString()) && votingRoundStatus === 'ended';
</script>

<div
	class="card"
	class:active={isSelected}
	class:eligible={votingEnabled}
	class:winner={isWinner}
	on:click={handleSelectOption}
>
	{#if userVotedOption === votingOption.option_number}
		<div class="voted-option">
			<span class="xsmall row-1 align-center">
				<Icon icon="lucide:vote" color="var(--clr-primary-main)" />
				Your vote
			</span>
		</div>
	{/if}
	<div class="column-1">
		<div class="row-2 align-center">
			{#if isWinner}
				<Icon icon="tabler:trophy" color="var(--clr-primary-main)" />
			{:else if votingEnabled}
				{#if isSelected}
					<Icon icon="tabler:circle-check-filled" color="var(--clr-primary-main)" />
				{:else}
					<Icon icon="tabler:circle" />
				{/if}
			{/if}
			<h5 class="text-small w-medium">{votingOption.name}</h5>
		</div>
		<span class="text-xsmall off">{`Option ${votingOption.option_number}`}</span>
	</div>
	<div class="column-1 align-end">
		<span class="votes text-small">
			{amountOfVotes}
			<span>votes</span>
		</span>
		<span class="text-xsmall">{votesPercentage}</span>
	</div>
</div>

<style lang="scss">
	.card {
		display: flex;
		flex-direction: row;
		position: relative;
		gap: var(--space-6);
		justify-content: space-between;
		background-color: var(--clr-surface-primary);
		padding: var(--space-3);
		border-radius: var(--radius-1);

		&.eligible {
			cursor: pointer;
		}

		&.active {
			border-color: var(--clr-primary-main);
		}

		&.winner {
			border-color: var(--clr-primary-main);
		}

		h5 {
			margin: 0;
			color: var(--clr-heading-main);
		}

		.votes {
			color: var(--clr-heading-main);
		}

		.off {
			color: var(--clr-text-off);
		}

		.voted-option {
			background-color: var(--clr-surface-secondary);
			border: 1px solid var(--clr-border-primary);
			border-radius: var(--radius-0);
			position: absolute;
			bottom: -0.5em;
			left: 50%;
			transform: translateX(-50%);
			padding-inline: var(--space-2);
		}
	}
</style>
