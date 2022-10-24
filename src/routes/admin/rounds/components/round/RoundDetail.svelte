<script type="ts">
	import type { Round } from '$lib/types/dao-project.interface';
	import { Ball } from '$atoms';
	import { Row } from '@mateoroldos/svelte.bones';
	import { daysOfDifference, formatDate } from '$lib/utilities/formatDate';
	import { Button } from '@emerald-dao/component-library';

	export let round: Round;

	const goalReached = round.goal < round.raised;
</script>

<div class="main-wrapper">
	<Row gap={1}>
		<Ball
			width={0.8}
			status={round.status === 'active' ? 'active' : goalReached ? 'success' : 'error'}
		/>
		<span class="goal">${round.currency} {round.goal}</span>
		<span class="date">{`${formatDate(round.startDate)} > ${formatDate(round.finishDate)}`}</span>
	</Row>
	<Row gap={1}>
		{#if round.status === 'active'}
			<progress value={round.raised} max={round.goal}>{round.raised}</progress>
			<span class="date">{`${daysOfDifference(new Date(), round.finishDate)} days left`}</span>
		{:else if round.status === 'finished'}
			<Button size="x-small" type="transparent" state={round.distributed ? 'disabled' : 'active'}
				>Distribute reserve</Button
			>
			<Button size="x-small" type="transparent" state={round.withdrawn ? 'disabled' : 'active'}
				>Withdraw to treasury</Button
			>
		{/if}
	</Row>
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		padding-bottom: 1em;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px var(--clr-neutral-900-t9) solid;
		width: 100%;

		.goal {
			--font-weight: 500;
			font-size: var(--fs-100);
			color: var(--clr-font-heading);
		}

		.date {
			font-size: var(--fs-100);
		}
	}
</style>
