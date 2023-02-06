<script type="ts">
	import Icon from '@iconify/svelte';
	import { generatorActiveStep } from '$stores/generator/GeneratorSteps';

	export let title: string;
	export let stepNumber: number;
</script>

<div class="card-primary">
	<h4>{title}</h4>
	<div class="column-3 align-start">
		<slot />
	</div>
	<div class="edit-wrapper" on:click={() => generatorActiveStep.goToStep(stepNumber)} on:keydown>
		<Icon icon="tabler:edit" color="var(--clr-primary-main)" />
	</div>
</div>

<style type="scss">
	.card-primary {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.8rem;
		width: 100%;

		h4 {
			font-size: var(--fs-400);
		}

		.edit-wrapper {
			position: absolute;
			top: 25px;
			right: 25px;
			cursor: pointer;
		}
	}
</style>
