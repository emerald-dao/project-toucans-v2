<script type="ts">
	import Icon from '@iconify/svelte';
	import type { StepState } from '$lib/types/generator/generator-step-state.type';

	export let status: StepState;
	export let width: number | 'auto' = 'auto';
</script>

<div class={status} style={`width: ${width}rem`}>
	<slot>
		{#if status === 'loading'}
			<div class="icon-wrapper rotate">
				<Icon icon="tabler:loader-2" color="var(--clr-secondary-main)" />
			</div>
		{/if}
	</slot>
</div>

<style type="scss">
	div {
		aspect-ratio: 1 / 1;
		width: fit-content;
		border-radius: 100%;
		display: grid;
		place-content: center;
		font-size: var(--fs-200);
		transition: 0.7s;
	}

	.inactive {
		background-color: var(--clr-neutral-300-t4);
		border: 2px var(--clr-neutral-300) solid;
	}

	.active {
		background-color: var(--clr-neutral-300);
		box-shadow: var(--clr-primary-main-t4) 0px 0px 4px 0px,
			var(--clr-primary-main-t5) 0px 0px 10px 0px;
		border: 2px var(--clr-primary-main) solid;
	}

	.loading {
		background-color: var(--clr-neutral-300);
		box-shadow: var(--clr-secondary-main-t4) 0px 0px 4px 0px,
			var(--clr-secondary-main-t5) 0px 0px 10px 0px;
		border: 2px var(--clr-secondary-main) solid;
	}

	.ready {
		background-color: var(--clr-primary-main);
		border: 2px var(--clr-primary-main) solid;
	}

	.success {
		background-color: var(--clr-primary-main);
		border: 2px var(--clr-primary-main) solid;
	}

	.error {
		background-color: var(--clr-neutral-300);
		border: 2px var(--clr-alert-main) solid;
	}
</style>
