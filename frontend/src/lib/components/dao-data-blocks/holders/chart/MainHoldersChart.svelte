<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import PieChart from '$components/charts/PieChart.svelte';
	import type { FindMap } from '$lib/types/common/find.interface';
	import { getFindNamesBatch } from '$flow/utils';

	export let daoData: DAOProject;

	const lpAddresses = Object.values(daoData.onChainData.lpAddresses);
	const mainHolders = Object.entries(daoData.onChainData.balances)
		.filter((entry) => entry[0] !== daoData.generalInfo.owner && !lpAddresses.includes(entry[0]))
		.sort((a, b) => Number(b[1]) - Number(a[1]))
		.slice(0, 6);
	const mainHoldersAccounts = mainHolders.map((holder) => holder[0]);
	const mainHoldersAmounts = mainHolders.map((holder) => Number(holder[1]));

	async function fetchFindNames() {
		const findNames: FindMap = await getFindNamesBatch(mainHoldersAccounts);
		return mainHoldersAccounts.map((holder) => findNames[holder] || holder);
	}
</script>

<div class="panel-container">
	{#if mainHoldersAmounts.length < 1}
		<span><em>This token has no holders yet</em></span>
	{:else}
		<div class="chart-wrapper">
			{#await fetchFindNames()}
				<PieChart
					title="Token distribution"
					chartData={mainHoldersAmounts}
					labels={mainHoldersAccounts}
				/>
			{:then findNames}
				<PieChart title="Token distribution" chartData={mainHoldersAmounts} labels={findNames} />
			{/await}
		</div>
	{/if}
</div>

<style type="scss">
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
