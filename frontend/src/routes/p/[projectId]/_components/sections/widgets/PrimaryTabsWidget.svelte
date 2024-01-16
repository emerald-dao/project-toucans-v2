<script lang="ts">
	import LiquidityPoolsChart from '$lib/components/dao-data-blocks/pools/chart/LiquidityPoolsChart.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Tab, TabList, TabPanel, Tabs } from '@emerald-dao/component-library';
	import MainHoldersLeaderboard from '$components/dao-data-blocks/holders/leaderboard/MainHoldersLeaderboard.svelte';
	import MainFundersLeaderboard from '$components/dao-data-blocks/funders/leaderboard/MainFundersLeaderboard.svelte';
	import NFTDonorsLeaderboard from '$components/dao-data-blocks/funders/leaderboard/NFTDonorsLeaderboard.svelte';

	export let daoData: DAOProject;
</script>

<div class="card">
	<Tabs>
		<div class="list-wrapper">
			<TabList>
				<Tab>Funders</Tab>
				<Tab>NFT Donors</Tab>
				{#if daoData.hasToken}
					<Tab>Holders</Tab>
					<Tab>Liquidity Pools</Tab>
				{/if}
			</TabList>
		</div>
		<div class="content-wrapper">
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
		</div>
	</Tabs>
</div>

<style lang="scss">
	.card {
		padding: var(--space-6) 0;
		overflow-x: scroll;

		&::-webkit-scrollbar-track {
			border: none;
			margin: var(--space-4);
		}

		@include mq('small') {
			padding: var(--space-8) 0;
			overflow-x: auto;
		}

		.list-wrapper,
		.content-wrapper {
			padding: 0 var(--space-6);

			@include mq('small') {
				padding: 0 var(--space-8);
			}
		}
	}
</style>
