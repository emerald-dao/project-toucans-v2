<script type="ts">
	import type { StepState } from '$lib/types/generator/generator-step-state.type';

	export let status: StepState;
</script>

<div class={status}>
	<slot />
</div>

<style type="scss">
	div {
		aspect-ratio: 1 / 1;
		width: fit-content;
		padding: 2rem;
		border-radius: 100%;
		display: grid;
		place-content: center;
	}

	.inactive {
		background-color: var(--clr-neutral-300);
	}

	.active {
		background-color: var(--clr-secondary-main);
		color: var(--clr-font-text-inverse);
	}

	.ready {
		background-color: var(--clr-primary-main);
		border: 1px var(--clr-success-main) solid;
	}

	.loading {
		background-color: pink;
	}

	.success {
		background-color: var(--clr-success-main);
	}

	.error {
		background-color: var(--clr-alert-main);
	}
</style>
