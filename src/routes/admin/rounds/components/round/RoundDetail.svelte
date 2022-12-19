<script type="ts">
	import type { Round } from '$lib/types/dao-project.interface';
	import { Ball } from '$atoms';
	import { Row } from '@mateoroldos/svelte.bones';
	import { daysOfDifference, formatDate } from '$lib/utilities/formatDate';
	import { Button, Currency, Label, ProgressBar } from '@emerald-dao/component-library';

	export let round: Round;

	console.log(round);

	const goalReached = round.goal < round.raised;
</script>

<div class="main-wrapper row-space-between align-center">
	<div class="row-9 align-center">
		<div class="row-3 align-center">
			<Ball
				width={0.8}
				status={round.status === 'active' ? 'active' : goalReached ? 'success' : 'error'}
			/>
			<Currency amount={round.goal} currency={round.currency} fontSize="1.2rem" />
		</div>
		<span class="xsmall">{`${formatDate(round.startDate)} > ${formatDate(round.finishDate)}`}</span>
	</div>
	<div class="row-5">
		{#if round.status === 'active'}
			<div class="progress-bar-wrapper">
				<ProgressBar
					value={round.raised}
					max={round.goal}
					labelText={`$${round.raised.toLocaleString()} raised`}
					helperText={`${((round.raised / round.goal) * 100).toLocaleString()}%`}
				/>
			</div>
			<Label color="transparent" iconLeft="tabler:clock-hour-5" size="x-small">
				{`${daysOfDifference(new Date(), round.finishDate)} days left`}
			</Label>
		{:else if round.status === 'finished'}
			<div class="row-3">
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
					state={round.withdrawn ? 'disabled' : 'active'}>Withdraw to treasury</Button
				>
			</div>
		{/if}
	</div>
</div>

<style type="scss">
	.main-wrapper {
		padding-bottom: var(--space-4);
		border-bottom: 0.5px var(--clr-border-primary) solid;
		width: 100%;

		.progress-bar-wrapper {
			min-width: 150px;
			max-width: 180px;
		}
	}
</style>
