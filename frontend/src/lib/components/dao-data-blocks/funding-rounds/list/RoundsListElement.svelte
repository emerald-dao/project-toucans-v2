<script type="ts">
	import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';
	import FundingNumbers from '../atoms/FundingNumbers.svelte';
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import SeeRoundDetailsModal from '../atoms/SeeRoundDetailsModal.svelte';
	import GoalReached from '$components/atoms/GoalReached.svelte';
	import RoundStatusLabel from '../atoms/RoundStatusLabel.svelte';
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { getRoundTiming } from '../helpers/getRoundTiming';
	import { getRoundStatus } from '../helpers/getRoundStatus';
	import { togglePurchasingExecution } from '$flow/actions';
	import EditRoundModal from '$lib/features/edit-round/components/EditRoundModal.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let round: FundingCycle;
	export let daoData: DAOProject;
	// cycleId
	let roundId: number = Number(round.details.cycleId);
	// cycleIndex
	export let roundNumber: number;
	// cycleId
	export let activeRound: number | null;
	export let admin: boolean = false;
	export let paused: boolean = true;

	$: goal = round.details.fundingTarget ? Number(round.details.fundingTarget) : 'infinite';
	$: funding = round.raisedTowardsGoal ? Number(round.raisedTowardsGoal) : 0;

	$: goalReached = goal != 'infinite' ? (goal as number) <= funding : false;

	$: startDate = new Date(Number(round.details.timeframe.startTime) * 1000);
	$: endDate = round.details.timeframe.endTime
		? new Date(Number(round.details.timeframe.endTime) * 1000)
		: null;

	$: roundStatus = getRoundStatus(roundId, activeRound, startDate);
</script>

<div class="main-wrapper row-space-between align-center">
	<div class="row-4 align-center">
		<IconCircle
			icon={`${roundNumber + 1}`}
			color={roundStatus === 'active'
				? 'primary'
				: roundStatus === 'upcoming'
				? 'tertiary'
				: 'alert'}
		/>
		<FundingNumbers {goal} {funding} paymentToken={daoData.onChainData.paymentCurrency} />
		{#if endDate == null && roundStatus === 'active' && admin}
			{#if paused}
				<Button
					color="neutral"
					type="ghost"
					size="x-small"
					on:click={() => togglePurchasingExecution(daoData.generalInfo.project_id)}
				>
					<Icon icon="tabler:player-play-filled" />
					Start
				</Button>
			{:else}
				<Button
					color="neutral"
					type="ghost"
					size="x-small"
					on:click={() => togglePurchasingExecution(daoData.generalInfo.project_id)}
				>
					<Icon icon="tabler:player-pause-filled" />
					Pause
				</Button>
			{/if}
		{/if}
		{#if goalReached}
			<GoalReached />
		{/if}
	</div>
	<div class="row-5 align-center">
		<span class="xsmall date">
			{getRoundTiming(startDate, endDate, roundStatus === 'active')}
		</span>
		<RoundStatusLabel status={roundStatus} />
		<div class="row-2">
			{#if roundStatus !== 'finished' && admin}
				<EditRoundModal {round} cycleIndex={roundNumber} {daoData} />
			{/if}
			{#if daoData.generalInfo.token_symbol}
				<SeeRoundDetailsModal
					{round}
					{roundNumber}
					projectToken={daoData.generalInfo.token_symbol}
					paymentToken={daoData.onChainData.paymentCurrency}
					projectId={daoData.generalInfo.project_id}
					{activeRound}
				/>
			{/if}
		</div>
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
