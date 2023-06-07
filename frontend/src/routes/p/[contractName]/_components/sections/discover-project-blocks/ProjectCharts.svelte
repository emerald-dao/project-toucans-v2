<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Tab, TabList, TabPanel, Tabs } from '@emerald-dao/component-library';
	import {
		LiquidityPoolsChart,
		MainFundersChart,
		MainHoldersChart
	} from '$components/dao-data-blocks';

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
