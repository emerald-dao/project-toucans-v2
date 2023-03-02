<script type="ts">
	import DataCard from '$components/atoms/cards/DataCard.svelte';
	import LineChart from '$components/charts/LineChart.svelte';
	import type { FinancialDao } from '$lib/types/dao-project/dao-project.interface';
	import { getMonthlyFundingFromRounds } from '$lib/utilities/getMonthlyFundings';
	import { Button, ProgressBar } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let daoData: FinancialDao;

	$: fundingsPerMonth = daoData.purchaseHistory.length > 0 ? getMonthlyFundingFromRounds(daoData.purchaseHistory): null;
</script>

<div class="main-wrapper">
	<DataCard title="Token" data={`$${daoData.token_symbol}`} hasBackground={true} />
	<DataCard
		title="Circulating Supply"
		data={Number(daoData.totalFunding).toLocaleString()}
		icon="tabler:home"
	/>
	<DataCard
		title="Max Supply"
		data={Number(daoData.totalSupply).toLocaleString()}
		icon="tabler:home"
	/>
	<div class="chart-card-wrapper">
		<DataCard
			title="Funding History"
			paddingBlock="var(--space-8)"
			icon="tabler:chart-line"
			height="100%"
		>
			{#if daoData.fundingCycles && fundingsPerMonth}
				<div class="chart-wrapper">
					<LineChart title={`${daoData.name} Funding`} chartData={fundingsPerMonth.data} labels={fundingsPerMonth.labels} />
				</div>
			{:else}
				<div class="no-funding-wrapper">
					<Icon width="1.6rem" icon="tabler:mood-empty" />
					<span>No funding history</span>
				</div>
			{/if}
		</DataCard>
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-10);
		height: 100%;

		@include mq('medium') {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: auto 1fr;
			grid-column-gap: var(--space-5);
			grid-row-gap: var(--space-6);
			grid-template-areas:
				'card-1 card-2 card-3'
				'chart-card chart-card chart-card';
		}

		.chart-card-wrapper {
			grid-area: chart-card;

			.chart-wrapper {
				width: auto;
				height: 100%;
				display: grid;
				place-items: center;
			}

			.no-funding-wrapper {
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: var(--space-1);
				color: var(--clr-text-off);

				span {
					font-size: var(--font-size-2);
					font-style: italic;
				}
			}
		}
	}
</style>
