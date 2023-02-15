<script type="ts">
	import type { FundingCycle } from '$lib/types/funding-cycle.interface';
	import Icon from '@iconify/svelte';
	import { formatDate } from '$lib/utilities/formatDate';
	import { Modal, getModal, ProgressBar, StatusCircle, Currency } from '@emerald-dao/component-library';
	import FundingStats from '$components/atoms/FundingStats.svelte';

	export let round: FundingCycle;
	export let i: number;

	const goalReached = round.details.fundingTarget < round.paymentTokensSent;
	const active = new Date(Number(round.details.timeframe.endTime)) >= new Date();
</script>

<div class="main-wrapper row-space-between align-center">
	<div class="row-4 align-center">
		<StatusCircle width="0.5rem" status={active ? 'active' : goalReached ? 'success' : 'alert'} />
		<Currency fontSize="0.9rem" amount={Number(round.paymentTokensSent)} currency="FLOW" color="heading" />
		<div class="progress-bar-wrapper">
			<ProgressBar
				value={Number(round.paymentTokensSent)}
				max={Number(round.details.fundingTarget)}
				size="small"
			/>
		</div>
	</div>
	<div class="row-5 align-center">
		<span class="xsmall display-handling"
			>{`${formatDate(new Date(Number(round.details.timeframe.startTime) * 1000))} to ${formatDate(
				new Date(Number(round.details.timeframe.endTime) * 1000)
			)}`}</span
		>
		<div class="header-link" on:click={() => getModal(`funding-stats-${i}`).open()} on:keydown>
			<Icon icon="tabler:eye" />
		</div>	
	</div>
</div>
<Modal background="var(--clr-background-secondary)" id={`funding-stats-${i}`}>
	<FundingStats fundingCycleData={round} hasBorder={false} title="Funding round data" />
</Modal>

<style type="scss">
	.main-wrapper {
		padding: var(--space-3) 0;
		border-bottom: 1px var(--clr-border-primary) solid;
		width: 100%;

		.progress-bar-wrapper {
			width: 100px;
			margin-left: var(--space-3);
		}

		.display-handling {
			display: none;

			@include mq('medium') {
				display: block;
			}
		}
	}
</style>
