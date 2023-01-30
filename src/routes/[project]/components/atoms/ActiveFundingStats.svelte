<script type="ts">
	import { daysOfDifference } from '$lib/utilities/formatDate';
	import { Currency, ProgressBar, TooltipIcon } from '@emerald-dao/component-library';
	import { getMonthlyFundingFromRounds } from '$lib/utilities/getMonthlyFundings';
	import LineChart from '$components/charts/LineChart.svelte';
	import Icon from '@iconify/svelte';
	import ChartTitle from './ChartTitle.svelte';

	export let daoData;

	const fundingsPerMonth = getMonthlyFundingFromRounds([daoData.fundingCycles[0]]);

	const months: string[] = fundingsPerMonth.map((x) => x[0]);
	const amounts: number[] = fundingsPerMonth.map((x) => x[1]);
</script>

<div class="card column">
	<div class="data-wrapper">
		<div class="row-space-between">
			<ChartTitle title="Active Funding Round" icon="tabler:activity-heartbeat" />
			<span class="time-left xsmall">
				<Icon icon="tabler:clock" />
				{daysOfDifference(
					new Date(),
					new Date(Number(daoData.fundingCycles[0].details.timeFrame.endTime))
				)} days left
			</span>
		</div>
		<div class="funding-stats-wrapper">
			<div class="chart-data-card">
				<p class="xsmall">Raised</p>
				<Currency
					amount={Number(daoData.fundingCycles[0].numOfFlowContributed)}
					currency="FLOW"
					fontSize="var(--font-size-1)"
					color="heading"
				/>
			</div>
			<div class="chart-data-card">
				<p class="xsmall">Goal</p>
				<Currency
					amount={Number(daoData.fundingCycles[0].details.fundingTarget)}
					currency="FLOW"
					fontSize="var(--font-size-1)"
					color="heading"
				/>
			</div>
			<div class="chart-data-card">
				<div class="row-1">
					<p class="xsmall">Reserve rate</p>
					<TooltipIcon width={0.7} tooltip="description" />
				</div>
				<span class="small w-medium">{Number(daoData.fundingCycles[0].details.reserveRate)}</span>
			</div>
			<div class="chart-data-card">
				<div class="row-1">
					<p class="xsmall">Issuance</p>
					<TooltipIcon width={0.7} tooltip="description" />
				</div>
				<span class="small w-medium">
					{Number(daoData.fundingCycles[0].details.issuanceRate)}
				</span>
			</div>
		</div>
		<ProgressBar
			value={Number(daoData.fundingCycles[0].numOfFlowContributed)}
			max={Number(daoData.fundingCycles[0].details.fundingTarget)}
		/>
	</div>
	<div class="chart-wrapper">
		<LineChart title="Active Round" chartData={amounts} labels={months} />
	</div>
</div>

<style type="scss">
	.data-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);

		.time-left {
			color: var(--clr-alert-main);
			display: flex;
			align-items: center;
			gap: var(--space-1);
		}

		.funding-stats-wrapper {
			display: grid;
			grid-template-columns: repeat(2, 4fr) repeat(2, 3fr);
			gap: var(--space-1);

			.chart-data-card {
				padding: var(--space-3) var(--space-4);
				background-color: var(--clr-surface-primary);

				span {
					color: var(--clr-heading-main);
				}

				&:first-child,
				&:nth-child(2) {
					background-color: var(--clr-surface-secondary);
				}

				&:first-child {
					border-radius: var(--radius-2) 0 0 var(--radius-2);
				}

				&:last-child {
					border-radius: 0 var(--radius-2) var(--radius-2) 0;
				}
			}
		}
	}

	.chart-wrapper {
		margin-top: var(--space-7);

		@include mq(small) {
			width: auto;
		}
	}
</style>
