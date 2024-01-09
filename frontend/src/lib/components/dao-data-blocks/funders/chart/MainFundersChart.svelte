<script lang="ts">
	import PieChart from '$components/charts/PieChart.svelte';
	import { getFindNamesBatch } from '$flow/utils';
	import type { FindMap } from '$lib/types/common/find.interface';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;

	const mainFunders = Object.entries(daoData.funding.funders)
		.sort((a, b) => Number(b[1].amount) - Number(a[1].amount))
		.slice(0, 6);
	const mainFundersAccounts = mainFunders.map((holder) => holder[0]);
	const mainFundersAmounts = mainFunders.map((holder) => Number(holder[1]));

	async function getFindInfo() {
		const findNames: FindMap = await getFindNamesBatch(mainFundersAccounts);
		return mainFundersAccounts.map((funder) => findNames[funder] || funder);
	}
</script>

<div class="panel-container">
	{#if mainFundersAmounts.length < 1}
		<span><em>This token has no funders yet</em></span>
	{:else}
		<div class="chart-wrapper">
			{#await getFindInfo()}
				<PieChart
					title="Token distribution"
					chartData={mainFundersAmounts}
					labels={mainFundersAccounts}
				/>
			{:then findNames}
				<PieChart title="Token distribution" chartData={mainFundersAmounts} labels={findNames} />
			{/await}
		</div>
	{/if}
</div>

<style lang="scss">
	.panel-container {
		display: flex;
		justify-content: center;
		min-height: var(--space-20);
		align-items: center;

		em {
			color: var(--clr-text-off);
		}

		.chart-wrapper {
			margin-top: var(--space-6);
			position: relative;
			width: 40vw;
			align-self: center;

			@include mq('medium') {
				width: auto;
				max-width: 400px;
			}
		}
	}
</style>
