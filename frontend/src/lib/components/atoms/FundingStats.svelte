<script type="ts">
	import { daysOfDifference } from '$lib/utilities/formatDate';
	import { Currency, ProgressBar, TooltipIcon } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import ChartTitle from '../../../routes/[contractName]/__components/atoms/ChartTitle.svelte';
	import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';

	export let fundingCycleData: FundingCycle | null;

	let daysLeft: number;

	if (fundingCycleData) {
		daysLeft = daysOfDifference(
			new Date(),
			new Date(Number(fundingCycleData.details.timeframe.endTime) * 1000)
		);
	}

	export let title = 'Active Funding Round';
	export let hasBorder = true;
</script>

{#if fundingCycleData}
	<div class:card={hasBorder}>
		<div class="data-wrapper">
			<div class="row-space-between">
				<ChartTitle {title} icon="tabler:activity-heartbeat" />
				<span class="time-left xsmall">
					<Icon icon="tabler:clock" />
					{#if daysLeft < 0}
						Finished {(-daysLeft).toLocaleString()} days ago
					{:else if daysLeft === 0}
						Finishes today
					{:else}
						{daysLeft.toLocaleString()} days left
					{/if}
				</span>
			</div>
			<div class="funding-stats-wrapper">
				<div class="chart-data-card">
					<p class="xsmall">Raised</p>
					<Currency
						amount={Number(fundingCycleData.paymentTokensSent)}
						currency="FLOW"
						fontSize="var(--font-size-2)"
						color="heading"
					/>
				</div>
				<div class="chart-data-card">
					<p class="xsmall">Goal</p>
					<Currency
						amount={Number(fundingCycleData.details.fundingTarget)}
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
					<span class="small">{Number(fundingCycleData.details.reserveRate)}</span>
				</div>
				<div class="chart-data-card">
					<div class="row-1">
						<p class="xsmall">Issuance</p>
						<TooltipIcon width={0.7} tooltip="description" />
					</div>
					<span class="small">
						{Number(fundingCycleData.details.issuanceRate)}
					</span>
				</div>
			</div>
			<ProgressBar
				value={Number(fundingCycleData.paymentTokensSent)}
				max={Number(fundingCycleData.details.fundingTarget)}
				size="large"
				showPercentage={true}
				min={0}
			/>
		</div>
	</div>
{/if}

<style type="scss">
	.card {
		background-color: var(--clr-background-secondary);
	}
	.data-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);

		.time-left {
			color: var(--clr-tertiary-main);
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
