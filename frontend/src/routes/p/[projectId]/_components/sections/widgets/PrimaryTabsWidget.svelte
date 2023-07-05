<script lang="ts">
	import LiquidityPoolsChart from '$lib/components/dao-data-blocks/pools/chart/LiquidityPoolsChart.svelte';
	import MainFundersChart from '$lib/components/dao-data-blocks/funders/chart/MainFundersChart.svelte';
	import MainHoldersChart from '$lib/components/dao-data-blocks/holders/chart/MainHoldersChart.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Tab, TabList, TabPanel, Tabs } from '@emerald-dao/component-library';
	import MainHoldersLeaderboard from '$components/dao-data-blocks/holders/leaderboard/MainHoldersLeaderboard.svelte';
	import MainFundersLeaderboard from '$components/dao-data-blocks/funders/leaderboard/MainFundersLeaderboard.svelte';

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
			<MainHoldersLeaderboard {daoData} />
		</TabPanel>
		<TabPanel>
			<MainFundersLeaderboard {daoData} />
		</TabPanel>
		<TabPanel>
			<LiquidityPoolsChart {daoData} />
		</TabPanel>
	</Tabs>
</div>
