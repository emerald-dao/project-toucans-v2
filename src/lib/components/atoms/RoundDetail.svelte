<script type="ts">
	import { Currencies } from '$lib/types/currencies.enum';
	import type { Round } from '$lib/types/dao-project.interface';
	import { daysOfDifference, formatDate } from '$lib/utilities/formatDate';
	import { Button, Label, ProgressBar, StatusCircle } from '@emerald-dao/component-library';

	export let round: Round;
	export let discover: boolean = false;

	const goalReached = round.details.fundingTarget < round.numOfFlowContributed;
	console.log(round.details.fundingTarget, round.numOfFlowContributed);
</script>

<div class="main-wrapper">
	<div class="row-9 align-center">
		<div class="row-4 align-center">
			<StatusCircle
				width="0.5rem"
				status={round.status === 'active' ? 'active' : goalReached ? 'success' : 'alert'}
			/>
			<div class="progress-bar-wrapper">
				<ProgressBar
					value={round.numOfFlowContributed}
					max={round.details.fundingTarget}
					labelText={`$${round.numOfFlowContributed.toLocaleString()} ${
						Currencies.FLOW
					} raised from $${round.details.fundingTarget.toLocaleString()} goal`}
					size="x-small"
				/>
			</div>
		</div>
		<span class="xsmall display-handling"
			>{`${formatDate(round.details.timeFrame.startTime)} to ${formatDate(
				round.details.timeFrame.endTime
			)}`}</span
		>
	</div>
	<div class="row-5 display-handling">
		{#if round.status === 'active'}
			<Label color="transparent" iconLeft="tabler:clock-hour-5" size="x-small">
				{`${-daysOfDifference(new Date(), round.details.timeFrame.endTime)} days left`}
			</Label>
		{:else if round.status === 'finished'}
			<div class="row-2 buttons-wrapper" class:page={discover}>
				<Button
					size="x-small"
					type="ghost"
					color="neutral"
					state={round.distributed ? 'disabled' : 'active'}>Distribute reserve</Button
				>
				<Button
					size="x-small"
					type="ghost"
					color="neutral"
					state={round.withdrawn ? 'disabled' : 'active'}
				>
					Withdraw to treasury
				</Button>
			</div>
		{/if}
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: grid;
		grid-template-columns: 1fr auto;
		padding: var(--space-3) 0;
		border-bottom: 1px var(--clr-border-primary) solid;
		width: 100%;
		gap: 2rem;

		.progress-bar-wrapper {
			width: 100%;
		}

		.display-handling {
			display: none;

			@include mq('medium') {
				display: block;
			}
		}

		.buttons-wrapper.page {
			display: none;
		}
	}
</style>
