<script type="ts">
	import ChartTitle from './../atoms/ChartTitle.svelte';
	import DataCard from '$lib/components/cards/DataCard.svelte';
	import type { FinancialDao } from '$lib/types/dao-project.interface';
	import MainFunders from '../atoms/MainFunders.svelte';
	import RecentActivity from '../atoms/RecentActivity.svelte';
	import { daysOfDifference } from '$lib/utilities/formatDate';
	import { Tabs, Tab, TabList, TabPanel } from '@emerald-dao/component-library';
	import LineChart from '$components/charts/LineChart.svelte';
	import { getMonthlyFundingFromRounds } from '$lib/utilities/getMonthlyFundings';
	import RoundDetail from '$components/atoms/RoundDetail.svelte';

	export let daoData;
	console.log(daoData);

	const fundingsPerMonth = getMonthlyFundingFromRounds([daoData.fundingCycles[0]]);

	const months: string[] = fundingsPerMonth.map((x) => x[0]);
	const amounts: number[] = fundingsPerMonth.map((x) => x[1]);
</script>

{#if daoData}
	<div class="column-10">
		<div class="main-wrapper column-8">
			<div class="boxes-wrapper">
				<DataCard
					title="Total Funding"
					icon="tabler:pig-money"
					data={daoData.totalBought.toLocaleString()}
				/>
				<DataCard
					title="Total Tokens"
					icon="tabler:coin"
					data={daoData.totalSupply.toLocaleString()}
				/>
				<DataCard title="Rounds" icon="tabler:rotate-dot" data={daoData.fundingCycles.length} />
			</div>
			<div class="card column">
				<div class="data-wrapper">
					<ChartTitle
						title="Active Round"
						data={`${daoData.fundingCycles[0].numOfFlowContributed.toLocaleString()} $FLOW raised`}
						icon="tabler:activity-heartbeat"
					/>
					<div class="row projections-wrapper">
						<div class="column goal-wrapper">
							<p class="xsmall">Goal</p>
							<span class="large w-medium"
								>{daoData.fundingCycles[0].fundingTarget.toLocaleString()}</span
							>
						</div>
						<div class="column days-left-wrapper">
							<p class="xsmall">Days left</p>
							<!-- <span class="large w-medium"
							>{daysOfDifference(new Date(), daoData.fundingCycles[0].finishDate)}</span
						> -->
						</div>
					</div>
				</div>
				<div class="chart-wrapper">
					<LineChart title="Active Round" chartData={amounts} labels={months} />
				</div>
			</div>
		</div>

		<Tabs>
			<TabList>
				<Tab>Recent Activity</Tab>
				<Tab>Main Funders</Tab>
				<Tab>Rounds</Tab>
			</TabList>
			<TabPanel>
				<RecentActivity />
			</TabPanel>
			<TabPanel>
				<MainFunders {daoData} />
			</TabPanel>
			<TabPanel>
				<div class="rounds-wrapper">
					<span class="heading">Active</span>
					{#each daoData.fundingCycles as round}
						{#if round.status === 'active'}
							<RoundDetail {round} />
						{/if}
					{/each}
				</div>
				<div class="rounds-wrapper">
					<span class="heading">Finished</span>
					{#each daoData.fundingCycles as round}
						{#if round.status != 'active'}
							<RoundDetail {round} discover={true} />
						{/if}
					{/each}
				</div>
			</TabPanel>
		</Tabs>
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

	.data-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--space-5);

		@include mq(medium) {
			flex-direction: row;
			gap: 0;
		}
	}
	.projections-wrapper {
		gap: var(--space-2);

		span {
			color: var(--clr-heading-main);
		}

		.goal-wrapper {
			padding: var(--space-3) var(--space-10) var(--space-3) var(--space-7);
			background-color: var(--clr-surface-primary);
			border-top-left-radius: var(--radius-4);
			border-bottom-left-radius: var(--radius-4);
		}

		.days-left-wrapper {
			padding: var(--space-3) var(--space-7);
			background-color: var(--clr-surface-primary);
			border-top-right-radius: var(--radius-4);
			border-bottom-right-radius: var(--radius-4);
		}
	}

	.chart-wrapper {
		margin-top: var(--space-7);

		@include mq(small) {
			width: auto;
		}
	}
	.rounds-wrapper {
		display: flex;
		flex-direction: column;

		span {
			margin: 0;
			margin-top: var(--space-2);
		}
	}
</style>
