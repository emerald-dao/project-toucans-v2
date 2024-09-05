<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { VotingOption } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
	import type { VotingRoundStore } from '$lib/features/voting-rounds/utils/createVotingRoundStore';

	export let votingOption: VotingOption;
	export let selectedOptionId: number | undefined;
	export let votingRoundStore: VotingRoundStore;

	const handleSelectOption = (votingEnabled: boolean) => {
		if (!votingEnabled) return;

		selectedOptionId = votingOption.id;
	};

	const getTotalAmountOfVotes = (votesResults: {
		[key in number]: number;
	}) => {
		return Object.values(votesResults).reduce((acc, votes) => acc + votes, 0);
	};

	$: isSelected = selectedOptionId === votingOption.id;
</script>

{#await $votingRoundStore.votingEligibility then votingEligibility}
	{#await $votingRoundStore.mostVotedOptions then mostVotedOptions}
		{#await $votingRoundStore.userVotes then userVotes}
			{#await $votingRoundStore.allVotes then allVotes}
				{#await $votingRoundStore.votesResults then votesResults}
					{@const votingEnabled =
						$votingRoundStore.votingStatus === 'active' && votingEligibility.eligible}
					{@const isWinner =
						mostVotedOptions.includes(votingOption.id.toString()) &&
						$votingRoundStore.votingStatus === 'ended'}
					{@const userVotesIds = userVotes.map((vote) => vote.selected_option)}
					{@const totalAmountOfVotes = getTotalAmountOfVotes(votesResults)}
					{@const thisOptionVotes = votesResults[votingOption.id]}
					{@const votesPercentage = ((thisOptionVotes * 100) / totalAmountOfVotes).toFixed(2)}
					<div
						class="card"
						class:active={isSelected}
						class:eligible={votingEnabled}
						class:winner={isWinner}
						on:click={() => handleSelectOption(votingEnabled)}
						on:keydown
					>
						{#if userVotesIds.includes(votingOption.id)}
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
							<span class="votes text-small text-right">
								{thisOptionVotes.toLocaleString()}
								<span>votes</span>
							</span>
							<span class="text-xsmall text-right"
								>{`${isNaN(Number(votesPercentage)) ? 0 : votesPercentage}%`}</span
							>
						</div>
					</div>
				{/await}
			{/await}
		{/await}
	{/await}
{/await}

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

		.text-right {
			text-align: right;
		}
	}
</style>
