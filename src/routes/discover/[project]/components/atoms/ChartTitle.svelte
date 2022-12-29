<script type="ts">
	import Icon from '@iconify/svelte';
	export let title: string;
	export let amountRaised: string;
	export let currency: string;
	export let goal: number;
	export let daysLeft: number;
	export let icon: string;
</script>

<div class="data-wrapper">
	<div class="column-1">
		<div class="row-2 align-center">
			<Icon {icon} />
			<span>{title}</span>
		</div>
		<h4 class="heading w-bold">{amountRaised} {currency} raised</h4>
	</div>
	<div class="row projections-wrapper">
		<div class="column goal-wrapper">
			<p class="xsmall">Goal</p>
			<span class="heading w-bold">{goal}</span>
		</div>
		<div class="column days-left-wrapper">
			<p class="xsmall">Days left</p>
			<span class="heading w-bold">{daysLeft}</span>
		</div>
	</div>
</div>

<style type="scss">
	.data-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	span {
		font-size: var(--font-size-4);
	}

	.projections-wrapper {
		gap: var(--space-2);

		.goal-wrapper {
			padding: var(--space-3) var(--space-10) var(--space-3) var(--space-7);
			background-color: var(--clr-surface-primary);
			border-top-left-radius: var(--radius-4);
			border-bottom-left-radius: var(--radius-4);
		}

		.days-left-wrapper {
			padding: var(--space-3) var(--space-7);
			background-color: var(--clr-surface-primary);
			border-top-right-radius: var(--radius-4);
			border-bottom-right-radius: var(--radius-4);
		}
	}
</style>
