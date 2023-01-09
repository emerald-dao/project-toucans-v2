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

	export let daoData: FinancialDao;

	const fundingsPerMonth = getMonthlyFundingFromRounds([daoData.rounds[0]]);

	const months: string[] = fundingsPerMonth.map((x) => x[0]);
	const amounts: number[] = fundingsPerMonth.map((x) => x[1]);
</script>

<div class="column-10">
	<div class="main-wrapper column-8">
		<div class="row-4">
			<DataCard
				title="Total Funding"
				icon="tabler:pig-money"
				data={daoData.totalFusdRaised.toLocaleString()}
			/>
			<DataCard title="Total Tokens" icon="tabler:coin" data={daoData.maxSupply.toLocaleString()} />
			<DataCard title="Rounds" icon="tabler:rotate-dot" data={daoData.rounds.length} />
		</div>
		<div class="card column">
			<div class="data-wrapper">
				<ChartTitle
					title="Active Round"
					data={`${daoData.rounds[0].raised.toLocaleString()} ${daoData.rounds[0].currency} raised`}
					icon="tabler:activity-heartbeat"
				/>
				<div class="row projections-wrapper">
					<div class="column goal-wrapper">
						<p class="xsmall">Goal</p>
						<span class="large w-medium">{daoData.rounds[0].goal.toLocaleString()}</span>
					</div>
					<div class="column days-left-wrapper">
						<p class="xsmall">Days left</p>
						<span class="large w-medium"
							>{daysOfDifference(new Date(), daoData.rounds[0].finishDate)}</span
						>
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
		</TabList>
		<TabPanel>
			<RecentActivity />
		</TabPanel>
		<TabPanel>
			<MainFunders />
		</TabPanel>
	</Tabs>
</div>

<style type="scss">
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
</style>
