<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Tab, TabList, TabPanel, Tabs } from '@emerald-dao/component-library';
	import {
		LiquidityPoolsChart,
		MainFundersChart,
		MainHoldersChart
	} from '$components/dao-data-blocks';
	import MainVotersChart from '$components/dao-data-blocks/votes/MainVotersChart.svelte';

	export let daoData: DAOProject;
</script>

<div class="card">
	<Tabs>
		<TabList>
			{#if daoData.hasToken}
				<Tab>Main holders</Tab>
			{/if}
			<Tab>Main funders</Tab>
			<Tab>Main Voters</Tab>
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
		<TabPanel>
			<MainVotersChart {daoData} />
		</TabPanel>
		{#if daoData.hasToken}
			<TabPanel>
				<LiquidityPoolsChart {daoData} />
			</TabPanel>
		{/if}
	</Tabs>
</div>
