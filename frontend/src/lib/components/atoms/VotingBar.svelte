<script lang="ts">
	import type { Vote } from '$lib/types/dao-project/bot-votes/votes.interface';
	import { ProgressBar } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let votingData: Vote;
</script>

<div class="card column-4">
	<div class="row-2 align-center">
		<p class="small">Current result</p>
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
	<div>
		<div class="row-space-between">
			<div class="row-3">
				<span class="xsmall success">{votingData.for_total} votes</span>
			</div>
			<div class="row-3">
				<span class="xsmall alert">{votingData.against_total} votes</span>
			</div>
		</div>
		<ProgressBar
			value={votingData.for_total}
			max={votingData.for_total + votingData.against_total}
			verticalLine={(votingData.for_total + votingData.against_total) / 2}
			backgroundColor="var(--clr-alert-main)"
			size="small"
		/>
	</div>
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
