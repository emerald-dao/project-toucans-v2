<script type="ts">
	import type { Round } from '$lib/types/dao-project.interface';
	import { Ball } from '$atoms';
	import { Row } from '@mateoroldos/svelte.bones';
	import { daysOfDifference, formatDate } from '$lib/utilities/formatDate';
	import { Button, Currency } from '@emerald-dao/component-library';

	export let round: Round;

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
	<Row gap={1}>
		{#if round.status === 'active'}
			<progress value={round.raised} max={round.goal}>{round.raised}</progress>
			<span class="date">{`${daysOfDifference(new Date(), round.finishDate)} days left`}</span>
		{:else if round.status === 'finished'}
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
		{/if}
	</Row>
</div>

<style type="scss">
	.main-wrapper {
		padding-bottom: var(--space-4);
		border-bottom: 0.5px var(--clr-border-primary) solid;
		width: 100%;
	}
</style>
