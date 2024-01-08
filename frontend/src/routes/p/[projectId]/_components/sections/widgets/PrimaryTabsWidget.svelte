<script lang="ts">
	import LiquidityPoolsChart from '$lib/components/dao-data-blocks/pools/chart/LiquidityPoolsChart.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Tab, TabList, TabPanel, Tabs, TooltipIcon } from '@emerald-dao/component-library';
	import MainHoldersLeaderboard from '$components/dao-data-blocks/holders/leaderboard/MainHoldersLeaderboard.svelte';
	import MainFundersLeaderboard from '$components/dao-data-blocks/funders/leaderboard/MainFundersLeaderboard.svelte';
	import NFTDonorsLeaderboard from '$components/dao-data-blocks/funders/leaderboard/NFTDonorsLeaderboard.svelte';

	export let daoData: DAOProject;
</script>

<div class="card">
	<Tabs>
		<TabList>
			<Tab>Funders</Tab>
			<Tab>NFT Donors</Tab>
			{#if daoData.hasToken}
				<Tab>Holders</Tab>
				<Tab>Liquidity Pools</Tab>
			{/if}
		</TabList>
		<TabPanel>
			<MainFundersLeaderboard {daoData} />
		</TabPanel>
		<TabPanel>
			<NFTDonorsLeaderboard {daoData} />
		</TabPanel>
		{#if daoData.hasToken}
			<TabPanel>
				<MainHoldersLeaderboard {daoData} />
			</TabPanel>
			<TabPanel>
				<LiquidityPoolsChart {daoData} />
			</TabPanel>
		{/if}
	</Tabs>
</div>
