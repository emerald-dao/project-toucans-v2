<script lang="ts">
	import LiquidityPoolsChart from '$lib/components/dao-data-blocks/pools/chart/LiquidityPoolsChart.svelte';
	import MainFundersChart from '$lib/components/dao-data-blocks/funders/chart/MainFundersChart.svelte';
	import MainHoldersChart from '$lib/components/dao-data-blocks/holders/chart/MainHoldersChart.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Tab, TabList, TabPanel, Tabs } from '@emerald-dao/component-library';

	export let daoData: DAOProject;
</script>

<div class="card">
	<Tabs>
		<TabList>
			{#if daoData.hasToken}
				<Tab>Main holders</Tab>
			{/if}
			<Tab>Main funders</Tab>
			{#if daoData.hasToken}
				<Tab>Liquidity pools</Tab>
			{/if}
		</TabList>
		{#if daoData.hasToken}
			<TabPanel>
				<MainHoldersChart {daoData} />
			</TabPanel>
		{/if}
		<TabPanel>
			<MainFundersChart {daoData} />
		</TabPanel>
		{#if daoData.hasToken}
			<TabPanel>
				<LiquidityPoolsChart {daoData} />
			</TabPanel>
		{/if}
	</Tabs>
</div>
