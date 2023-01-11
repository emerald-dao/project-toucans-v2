<script type="ts">
	import type { Round } from '$lib/types/dao-project.interface';
	import { daysOfDifference, formatDate } from '$lib/utilities/formatDate';
	import {
		Button,
		Currency,
		Label,
		ProgressBar,
		StatusCircle
	} from '@emerald-dao/component-library';

	export let rounds: Round;

	const goalReached = rounds.goal < rounds.raised;
</script>

<div class="main-wrapper">
	<div class="row-9 align-center">
		<div class="row-4 align-center">
			<StatusCircle
				width="0.5rem"
				status={rounds.status === 'active' ? 'active' : goalReached ? 'success' : 'alert'}
			/>
			<div class="progress-bar-wrapper">
				<ProgressBar
					value={rounds.raised}
					max={rounds.goal}
					labelText={`$${rounds.raised.toLocaleString()} ${
						rounds.currency
					} raised from $${rounds.goal.toLocaleString()} goal`}
					size="x-small"
				/>
			</div>
		</div>
		<span class="xsmall display-handling"
			>{`${formatDate(rounds.startDate)} to ${formatDate(rounds.finishDate)}`}</span
		>
	</div>
	<div class="row-5 display-handling">
		{#if rounds.status === 'active'}
			<Label color="transparent" iconLeft="tabler:clock-hour-5" size="x-small">
				{`${-daysOfDifference(new Date(), rounds.finishDate)} days left`}
			</Label>
		{:else if rounds.status === 'finished'}
			<div class="row-2">
				<Button
					size="x-small"
					type="ghost"
					color="neutral"
					state={rounds.distributed ? 'disabled' : 'active'}>Distribute reserve</Button
				>
				<Button
					size="x-small"
					type="ghost"
					color="neutral"
					state={rounds.withdrawn ? 'disabled' : 'active'}
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
		padding-bottom: var(--space-4);
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
	}
</style>
