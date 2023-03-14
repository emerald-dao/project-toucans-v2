<script type="ts">
	import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';
	import { daysOfDifference } from '$lib/utilities/formatDate';
	import FundingNumbers from './atoms/FundingNumbers.svelte';
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import SeeRoundDetailsModal from './atoms/SeeRoundDetailsModal.svelte';
	import GoalReached from '$components/atoms/GoalReached.svelte';

	export let round: FundingCycle;
	export let i: number;
	export let projectToken: string;

	$: goal = round.details.fundingTarget ? Number(round.details.fundingTarget) : 'infinite';
	$: funding = round.paymentTokensSent ? Number(round.paymentTokensSent) : 0;

	$: goalReached = goal !== 'infinite' ? goal < funding : false;

	$: startDate = new Date(Number(round.details.timeframe.startTime) * 1000);
	$: endDate = round.details.timeframe.endTime
		? new Date(Number(round.details.timeframe.endTime) * 1000)
		: null;

	$: active = endDate ? endDate >= new Date() : true;
</script>

<div class="main-wrapper row-space-between align-center">
	<div class="row-4 align-center">
		<IconCircle icon={`${i + 1}`} color={active ? 'primary' : 'tertiary'} />
		<FundingNumbers {goal} {funding} />
		{#if goalReached}
			<GoalReached />
		{/if}
	</div>
	<div class="row-5 align-center">
		{#if endDate != null}
			<span class="xsmall date">
				{`${daysOfDifference(startDate, endDate)}`}
				days left
			</span>
		{:else}
			<span class="xsmall date">Infinite duration</span>
		{/if}
		<SeeRoundDetailsModal {round} {i} {projectToken} />
	</div>
</div>

<style type="scss">
	.main-wrapper {
		padding: var(--space-3) 0;
		border-bottom: 1px var(--clr-neutral-badge) solid;
		width: 100%;

		.date {
			color: var(--clr-text-off);
		}
	}
</style>
