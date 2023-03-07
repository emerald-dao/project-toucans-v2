<script type="ts">
	import PieChart from '$components/charts/PieChart.svelte';
	import DataCard from '$components/atoms/cards/DataCard.svelte';
	import MainFunders from '../atoms/MainFunders.svelte';
	import RecentActivity from '../atoms/RecentActivity.svelte';
	import { Tabs, Tab, TabList, TabPanel } from '@emerald-dao/component-library';
	import RoundDetail from '$components/atoms/RoundDetail.svelte';
	import FundingStats from '$lib/components/atoms/FundingStats.svelte';
	import { getFundingCycleData } from '$lib/utilities/projects/getFundingCycleData';
	import LineChart from '$components/charts/LineChart.svelte';
	import { getMonthlyFundingFromRounds } from '$lib/utilities/getMonthlyFundings';
	import { getTotalFundingFromActions } from '$lib/utilities/getTotalFundingFromActions';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;

	console.log(daoData);

	const mainHoldersAmountMock = Object.values(daoData.onChainData.balances); // [100, 100, 100];
	const mainHoldersNamesMock = Object.keys(daoData.onChainData.balances); // ['mateo.find', 'jacob.find', 'dene.find'];

	const currentFundingCycleData = daoData.onChainData.currentFundingCycle
		? getFundingCycleData(daoData, Number(daoData.onChainData.currentFundingCycle))
		: null;

	let fundingPerMonth: {
		labels: string[];
		data: number[];
	} | null = null;

	// if (daoData.purchaseHistory.length > 0) {
	// 	fundingPerMonth = getMonthlyFundingFromRounds(daoData.purchaseHistory);
	// }

	const recentActivity = daoData.events
		? daoData.events.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6)
		: [];
</script>

{#if daoData}
	<div class="column-6">
		<div class="boxes-wrapper">
			<DataCard
				title="Total Funding"
				icon="tabler:pig-money"
				data={Number(daoData.onChainData.totalFunding)}
				isCurrency
			/>
			<DataCard
				title="Circulating Supply"
				icon="tabler:coin"
				data={Number(daoData.onChainData.totalSupply)}
				isCurrency
				currencyName={daoData.generalInfo.token_symbol}
			/>
		</div>
		{#if daoData.onChainData.fundingCycles.length > 0}
			<FundingStats fundingCycleData={currentFundingCycleData} />
		{/if}
		<div class="card">
			<Tabs>
				<TabList>
					<Tab>Main holders</Tab>
					{#if fundingPerMonth}
						<Tab>Fundraising history</Tab>
					{/if}
				</TabList>
				<TabPanel>
					<div class="panel-container">
						<!-- <div class="chart-wrapper">
							<PieChart
								title="Token distribution"
								chartData={mainHoldersAmountMock}
								labels={mainHoldersNamesMock}
							/>
						</div> -->
					</div>
				</TabPanel>
				{#if fundingPerMonth}
					<TabPanel>
						<div class="chart-wrapper">
							<LineChart
								title="Fundrising history"
								chartData={fundingPerMonth.data}
								labels={fundingPerMonth.labels}
							/>
						</div>
					</TabPanel>
				{/if}
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
