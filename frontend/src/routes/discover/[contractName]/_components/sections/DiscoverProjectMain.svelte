<script type="ts">
	import DataCard from '$components/atoms/cards/DataCard.svelte';
	import MainFunders from '../atoms/MainFunders.svelte';
	import RecentActivity from '../atoms/RecentActivity.svelte';
	import { Tabs, Tab, TabList, TabPanel } from '@emerald-dao/component-library';
	import RoundDetail from '$components/atoms/RoundDetail.svelte';
	import FundingStats from '$lib/components/atoms/FundingStats.svelte';
	import { getFundingCycleData } from '$lib/utilities/projects/getFundingCycleData';
	import LineChart from '$components/charts/LineChart.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import PieChart from '$components/charts/PieChart.svelte';
	import { user } from '$stores/flow/FlowStore';

	export let daoData: DAOProject;

	console.log(daoData);

	const mainHolders = Object.entries(daoData.onChainData.balances)
		.sort((a, b) => Number(b[1]) - Number(a[1]))
		.slice(0, 6);
	const mainHoldersAccounts = mainHolders.map((holder) => holder[0]);
	const mainHoldersAmounts = mainHolders.map((holder) => Number(holder[1]));

	const mainFunders = Object.entries(daoData.onChainData.funders)
		.sort((a, b) => Number(b[1]) - Number(a[1]))
		.slice(0, 6);
	const mainFundersAccounts = mainFunders.map((holder) => holder[0]);
	const mainFundersAmounts = mainFunders.map((holder) => Number(holder[1]));

	const currentFundingCycleData = daoData.onChainData.currentFundingCycle
		? getFundingCycleData(daoData, Number(daoData.onChainData.currentFundingCycle))
		: null;

	let fundingPerMonth: {
		labels: string[];
		data: number[];
	} | null = null;

	const recentActivity = daoData.events
		? daoData.events.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6)
		: [];
</script>

{#if daoData}
	<div class="column-6">
		<div class="boxes-wrapper">
			{#if $user.addr}
				<DataCard
					title="Your Balance"
					data={daoData.userBalance}
					isCurrency
					currencyName={daoData.generalInfo.token_symbol}
				/>
			{/if}
			<DataCard
				title="Circulating Supply"
				data={Number(daoData.onChainData.totalSupply)}
				isCurrency
				currencyName={daoData.generalInfo.token_symbol}
			/>
			<DataCard title="Total Funding" data={Number(daoData.onChainData.totalFunding)} isCurrency />
		</div>
		{#if daoData.onChainData.fundingCycles.length > 0}
			<FundingStats
				fundingCycleData={currentFundingCycleData}
				projectCurrency={daoData.generalInfo.token_symbol}
			/>
		{/if}
		<div class="card">
			<Tabs>
				<TabList>
					<Tab>Main holders</Tab>
					<Tab>Main funders</Tab>
				</TabList>
				<TabPanel>
					<div class="panel-container">
						<div class="chart-wrapper">
							<PieChart
								title="Token distribution"
								chartData={mainHoldersAmounts}
								labels={mainHoldersAccounts}
							/>
						</div>
					</div>
				</TabPanel>
				<TabPanel>
					<div class="panel-container">
						<div class="chart-wrapper">
							<PieChart
								title="Token distribution"
								chartData={mainFundersAmounts}
								labels={mainFundersAccounts}
							/>
						</div>
					</div>
				</TabPanel>
			</Tabs>
		</div>
		<div class="tabs-wrapper">
			<Tabs>
				<TabList>
					<Tab>Recent Activity</Tab>
					{#if fundingPerMonth}
						<Tab>Main Funders</Tab>
					{/if}
					<Tab>Rounds</Tab>
				</TabList>
				<TabPanel>
					<RecentActivity actions={recentActivity} />
				</TabPanel>
				{#if fundingPerMonth}
					<TabPanel>
						<MainFunders {daoData} />
					</TabPanel>
				{/if}
				<TabPanel>
					<div class="rounds-wrapper">
						{#each daoData.onChainData.fundingCycles as round}
							<RoundDetail {round} i={0} />
						{/each}
					</div>
				</TabPanel>
			</Tabs>
		</div>
	</div>
{/if}

<style type="scss">
	.boxes-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);

		@include mq(small) {
			flex-direction: row;
		}
	}

	.panel-container {
		display: flex;
		justify-content: center;

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

	.rounds-wrapper {
		display: flex;
		flex-direction: column;

		span {
			margin: 0;
			margin-top: var(--space-2);
			font-size: var(--font-size-1);
		}
	}

	.tabs-wrapper {
		min-height: 400px;
	}
</style>
