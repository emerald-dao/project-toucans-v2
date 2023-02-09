<script type="ts">
	import PieChart from '$components/charts/PieChart.svelte';
	import DataCard from '$lib/components/cards/DataCard.svelte';
	import MainFunders from '../atoms/MainFunders.svelte';
	import RecentActivity from '../atoms/RecentActivity.svelte';
	import { Tabs, Tab, TabList, TabPanel } from '@emerald-dao/component-library';
	import RoundDetail from '$components/atoms/RoundDetail.svelte';
	import FundingStats from '$lib/components/atoms/FundingStats.svelte';
	import type { FinancialDao } from '$lib/types/dao-project.interface';
	import { getFundingCycleData } from '$lib/utilities/projects/getFundingCycleData';
	import LineChart from '$components/charts/LineChart.svelte';
	import { getMonthlyFundingFromRounds } from '$lib/utilities/getMonthlyFundings';

	export let daoData: FinancialDao;
		
	const mainHoldersAmountMock = [100, 100, 100];
	const mainHoldersNamesMock = ['mateo.find', 'jacob.find', 'dene.find'];

	const currentFundingCycleData = daoData.currentFundingCycle ? getFundingCycleData(daoData, Number(daoData.currentFundingCycle)) : null;

	const fundingPerMonth = getMonthlyFundingFromRounds(daoData.actions)
	const recentActivity = daoData.actions.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);
	const totalFundingFromActions = daoData.actions.reduce((acc, action) => {
		if (action.type === "Purchase") {
			acc += Number(action.amount);
		}
		return acc;
	}, 0);
</script>

{#if daoData}
	<div class="column-6">
		<div class="boxes-wrapper">
			<DataCard
				title="Total Funding"
				icon="tabler:pig-money"
				data={Number(totalFundingFromActions)}
				isCurrency
			/>
			<DataCard
				title="Circulating Supply"
				icon="tabler:coin"
				data={Number(daoData.totalSupply)}
				isCurrency
				currencyName={daoData.token_symbol}
			/>
		</div>
		{#if daoData.fundingCycles.length > 0}
			<FundingStats fundingCycleData={currentFundingCycleData} />
		{/if}
		<div class="card">
			<Tabs>
				<TabList>
					<Tab>Main holders</Tab>
					<Tab>Fundrising history</Tab>
				</TabList>
				<TabPanel>
					<div class="panel-container">
						<div class="chart-wrapper">
							<PieChart title="Token distribution" chartData={mainHoldersAmountMock} labels={mainHoldersNamesMock} />
						</div>
					</div>
				</TabPanel>
				<TabPanel>
					<div class="chart-wrapper">
						<LineChart title="Fundrising history" chartData={fundingPerMonth.data} labels={fundingPerMonth.labels} />
					</div>
				</TabPanel>
			</Tabs>
		</div>
		<div class="tabs-wrapper">
			<Tabs>
				<TabList>
					<Tab>Recent Activity</Tab>
					<Tab>Main Funders</Tab>
					<Tab>Rounds</Tab>
				</TabList>
				<TabPanel>
					<RecentActivity actions={recentActivity} />
				</TabPanel>
				<TabPanel>
					<MainFunders {daoData} />
				</TabPanel>
				<TabPanel>
					<div class="rounds-wrapper">
						{#if daoData.currentFundingCycle}
							<span>Active</span>
							{#each daoData.fundingCycles as round}
								{#if round.details.cycleNum === daoData.currentFundingCycle}
									<RoundDetail {round} i={0} />
								{/if}
							{/each}
						{/if}
					</div>
					<div class="rounds-wrapper">
						<span>Finished</span>
						{#each daoData.fundingCycles as round, i}
							{#if round.details.cycleNum !== daoData.currentFundingCycle}
								<RoundDetail {round} {i} />
							{/if}
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
