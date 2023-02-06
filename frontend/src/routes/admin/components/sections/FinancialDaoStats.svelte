<script type="ts">
	import DataCard from '$components/cards/DataCard.svelte';
	import LineChart from '$components/charts/LineChart.svelte';
	import type { FinancialDao } from '$lib/types/dao-project.interface';
	import { getMonthlyFundingFromRounds } from '$lib/utilities/getMonthlyFundings';
	import { Button, ProgressBar } from '@emerald-dao/component-library';

	export let daoData: FinancialDao;

	let fundingsPerMonth;

	let months: string[];
	let amounts: number[];

	if (daoData.fundingCycles) {
		fundingsPerMonth = getMonthlyFundingFromRounds([daoData.fundingCycles[0]]);

		months = fundingsPerMonth.map((x) => x[0]);
		amounts = fundingsPerMonth.map((x) => x[1]);
	}
</script>

<div class="main-wrapper">
	<DataCard title="Token" data={`$${daoData.token_symbol}`} hasBackground={true} />
	<div class="data-card-display">
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
		{#if daoData.fundingCycles}
			<div class="chart-wrapper card">
				<LineChart title="Active Round" chartData={amounts} labels={months} />
			</div>
		{/if}
	</div>
	<DataCard
		title="Summary"
		hasBackground={true}
		paddingBlock="var(--space-8)"
		data={`${(Number(daoData.totalFunding) / Number(daoData.totalSupply)) * 100}%`}
	>
		<ProgressBar
			value={Number(daoData.totalSupply)}
			max={Number(daoData.totalSupply)}
			labelText="Distribution"
		/>
		<Button width="full-width">Distribute Tokens</Button>
	</DataCard>
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-10);

		@include mq('medium') {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: repeat(2, auto);
			grid-column-gap: var(--space-5);
			grid-row-gap: var(--space-6);
		}

		.data-card-display {
			display: none;
			height: fit-content;

			@include mq('medium') {
				display: contents;
			}
		}

		.chart-wrapper {
			grid-area: 2 / 1 / 3 / 3;
		}
	}
</style>
