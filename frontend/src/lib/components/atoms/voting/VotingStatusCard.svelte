<script lang="ts">
	import type { Vote } from '$lib/types/dao-project/bot-votes/votes.interface';
	import Icon from '@iconify/svelte';
	import VotingBar from './VotingBar.svelte';

	export let votingData: Vote;
</script>

<div class="card column-4">
	<div class="row-2 align-center">
		{#if votingData.pending === true}
			<p class="small">Current result</p>
		{/if}
		<div
			class="label row-1 align-center"
			class:success={votingData.for_total > votingData.against_total}
			class:alert={votingData.for_total < votingData.against_total}
		>
			{#if votingData.for_total > votingData.against_total}
				<Icon icon="tabler:check" />
				<span class="small success">Approved</span>
			{:else if votingData.for_total == votingData.against_total}
				<span class="small">Tie</span>
			{:else}
				<Icon icon="tabler:x" />
				<span class="small alert">Rejected</span>
			{/if}
		</div>
	</div>
	<VotingBar {votingData} />
</div>

<style lang="scss">
	.card {
		padding: var(--space-6);
		padding-bottom: var(--space-9);
		background-color: var(--clr-surface-primary);
		border-color: var(--clr-neutral-badge);

		.label {
			padding: 3px var(--space-3);
			border-radius: var(--space-2);
			font-weight: bold;
			background-color: var(--clr-neutral-badge);

			&.success {
				background-color: var(--clr-primary-badge);
			}

			&.alert {
				background-color: var(--clr-alert-badge);
			}
		}

		.success {
			color: var(--clr-primary-main);
		}

		.alert {
			color: var(--clr-alert-main);
		}
	}
</style>
