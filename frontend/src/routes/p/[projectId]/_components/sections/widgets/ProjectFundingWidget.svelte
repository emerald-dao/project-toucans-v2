<script lang="ts">
	import { browser } from '$app/environment';
	import RecentFundingChart from '$lib/components/dao-data-blocks/recent-funding/chart/RecentFundingChart.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Currency } from '@emerald-dao/component-library';

	export let daoData: DAOProject;
</script>

<div class="card">
	<div class="column-1 primary-wrapper">
		<p class="xsmall">Project Total Funding</p>
		<Currency
			amount={daoData.funding.total_funding || 0}
			moneyPrefix={true}
			fontSize="var(--font-size-5)"
			color="heading"
			decimalNumbers={2}
		/>
	</div>
	<div class="secondary-wrapper">
		{#if browser}
			<RecentFundingChart {daoData} />
		{/if}
		<span class="w-medium">Funding</span>
	</div>
</div>

<style lang="scss">
	.card {
		display: flex;
		flex-direction: column;
		padding: 0;
		overflow: hidden;

		@include mq('medium') {
			max-width: 250px;
		}

		.primary-wrapper,
		.secondary-wrapper {
			padding-inline: var(--space-7);
			padding-block: var(--space-6);
		}

		.primary-wrapper {
			flex: 1;
			display: flex;
			justify-content: center;
		}

		.secondary-wrapper {
			background-color: var(--clr-background-secondary);
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: var(--space-1);
			position: relative;
			border-top: 0.5px solid var(--clr-border-primary);
			min-height: var(--space-18);

			span {
				background-color: var(--clr-neutral-badge);
				padding-inline: var(--space-3);
				position: absolute;
				top: var(--space-4);
				left: var(--space-4);
				font-size: 0.7rem;
				border-radius: var(--radius-1);
			}
		}
	}
</style>
