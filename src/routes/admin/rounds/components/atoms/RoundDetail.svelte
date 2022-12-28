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

	export let round: Round;

	const goalReached = round.goal < round.raised;
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
					value={round.raised}
					max={round.goal}
					labelText={`$${round.raised.toLocaleString()} ${
						round.currency
					} raised from $${round.goal.toLocaleString()} goal`}
					size="x-small"
				/>
			</div>
		</div>
		<span class="xsmall">{`${formatDate(round.startDate)} to ${formatDate(round.finishDate)}`}</span
		>
	</div>
	<div class="row-5">
		{#if round.status === 'active'}
			<Label color="transparent" iconLeft="tabler:clock-hour-5" size="x-small">
				{`${-daysOfDifference(new Date(), round.finishDate)} days left`}
			</Label>
		{:else if round.status === 'finished'}
			<div class="row-2">
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
		padding-bottom: var(--space-4);
		border-bottom: 1px var(--clr-border-primary) solid;
		width: 100%;
		gap: 2rem;

		.progress-bar-wrapper {
			width: 100%;
		}
	}
</style>
