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
			<Tab>Main holders</Tab>
			<Tab>Main funders</Tab>
			<Tab>Liquidity pools</Tab>
		</TabList>

		<TabPanel>
			<MainHoldersChart {daoData} />
		</TabPanel>
		<TabPanel>
			<MainFundersChart {daoData} />
		</TabPanel>
		<TabPanel>
			<LiquidityPoolsChart {daoData} />
		</TabPanel>
	</Tabs>
</div>
