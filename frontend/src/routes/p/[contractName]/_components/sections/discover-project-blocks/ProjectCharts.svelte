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
			<Tab>
				<p>Main holders</p>
			</Tab>
			<Tab>
				<p>Main funders</p>
			</Tab>
			<Tab>
				<p>Liquidity pools</p>
			</Tab>
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

<style lang="scss">
	p {
		font-size: var(--font-size-0);
		line-height: normal;

		@include mq(medium) {
			font-size: var(--font-size-1);
		}
	}
</style>
