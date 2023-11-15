<script type="ts">
	import RoundStatusLabel from '../atoms/RoundStatusLabel.svelte';
	import { formatDate } from '$lib/utilities/formatDate';
	import {
		Currency,
		Modal,
		ProgressBar,
		TooltipIcon,
		getModal
	} from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';
	import FundingNumbers from '../atoms/FundingNumbers.svelte';
	import GoalReached from '../../../atoms/GoalReached.svelte';
	import OverflowCard from '../atoms/OverflowCard.svelte';
	import type { ECurrencies } from '$lib/types/common/enums';
	import { getRoundTiming } from '../helpers/getRoundTiming';
	import { getRoundStatus } from '../helpers/getRoundStatus';
	import PayoutsList from '../atoms/PayoutsList.svelte';

	export let round: FundingCycle;
	export let title = 'Active Funding Round';
	export let hasBorder = true;
	export let projectToken: string;
	export let paymentToken: ECurrencies;
	export let projectId: string;
	export let claimOverflow = false;
	export let activeRound: number | null;

	$: goal = round.details.fundingTarget ? Number(round.details.fundingTarget) : 'infinite';
	$: funding = round.raisedTowardsGoal ? Number(round.raisedTowardsGoal) : 0;

	$: goalReached = goal !== 'infinite' ? (goal as number) <= funding : false;
	$: overflow = goal !== 'infinite' ? funding - (goal as number) : 0;

	const startDate = new Date(Number(round.details.timeframe.startTime) * 1000);
	const endDate = round.details.timeframe.endTime
		? new Date(Number(round.details.timeframe.endTime) * 1000)
		: null;

	$: roundStatus = getRoundStatus(Number(round.details.cycleId), activeRound, startDate);
</script>

<div class:card={hasBorder}>
	<div class="data-wrapper">
		<div class="row-space-between">
			<div class="row-2 align-center">
				<h4 class="title w-regular">{title}</h4>
				<RoundStatusLabel status={roundStatus} />
				{#if goalReached}
					<GoalReached />
				{/if}
			</div>
			<span class="time-left xsmall">
				<Icon icon="tabler:clock" />
				{getRoundTiming(startDate, endDate, roundStatus === 'active')}
			</span>
		</div>
		{#if overflow > 0}
			<OverflowCard {projectId} {claimOverflow} />
		{/if}
		{#if goal !== 'infinite'}
			<ProgressBar
				value={Number(round.raisedTowardsGoal)}
				max={Number(round.details.fundingTarget)}
				size="large"
				showPercentage={true}
				min={0}
			>
				<div slot="label">
					<div class="flex">
						<FundingNumbers {goal} {funding} {paymentToken} fontSize="1.2rem" />
						{#if round.details.payouts.length > 0}
							<div class="header-link" on:click={() => getModal(`payouts-list`).open()} on:keydown>
								<Icon icon="tabler:message" />
							</div>
						{/if}
					</div>
					<Modal background="var(--clr-background-secondary)" id={`payouts-list`}>
						<PayoutsList amounts={round.details.payouts} />
					</Modal>
				</div>
			</ProgressBar>
		{:else}
			<FundingNumbers {goal} {funding} {paymentToken} fontSize="1.2rem" />
		{/if}
		<div class="funding-stats-wrapper">
			<div class="chart-data-card">
				<p class="xsmall">Start Date</p>
				<span class="xsmall">{formatDate(startDate)}</span>
			</div>
			<div class="chart-data-card">
				<p class="xsmall">End Date</p>
				<span class="xsmall">{endDate ? formatDate(endDate) : 'Infinite'}</span>
			</div>
			<div class="chart-data-card">
				<div class="row-1">
					<p class="xsmall">Reserve</p>
					<div class="tooltip-mobile-display">
						<TooltipIcon
							width={0.7}
							tooltip="The percentage of {projectToken} tokens minted during funding that get reserved in the treasury."
						/>
					</div>
				</div>
				<span class="xsmall">{Number(round.details.reserveRate) * 100 + '%'}</span>
			</div>
			<div class="chart-data-card">
				<div class="row-1">
					<p class="xsmall">Issuance</p>
					<div class="tooltip-mobile-display">
						<TooltipIcon
							width={0.7}
							tooltip="For every 1 {paymentToken} funded, {Number(
								round.details.issuanceRate
							)} {projectToken} will be minted."
						/>
					</div>
				</div>
				<Currency
					amount={Number(round.details.issuanceRate)}
					currency={projectToken}
					fontSize="var(--font-size-0)"
					color="heading"
					decimalNumbers={2}
				/>
			</div>
		</div>
	</div>
</div>

<style type="scss">
	.tooltip-mobile-display {
		display: none;
		@include mq('small') {
			display: block;
		}
	}
	.card {
		background-color: var(--clr-background-secondary);
	}
	.data-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);

		.title {
			font-size: var(--font-size-2);
			color: var(--clr-font-text);
		}

		.time-left {
			display: flex;
			align-items: center;
			gap: var(--space-1);
			color: var(--clr-text-off);
		}

		.funding-stats-wrapper {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--space-1);

			@include mq(medium) {
				grid-template-columns: 3fr 3fr 1fr 2fr;
			}

			.chart-data-card {
				padding: var(--space-3);
				background-color: var(--clr-surface-primary);

				span {
					color: var(--clr-heading-main);
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
</style>
