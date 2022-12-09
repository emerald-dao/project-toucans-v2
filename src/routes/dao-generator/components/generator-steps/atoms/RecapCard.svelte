<script type="ts">
	import Icon from '@iconify/svelte';
	import { Column } from '@mateoroldos/svelte.bones';
	import { generatorActiveStep } from '$stores/generator/GeneratorSteps';

	export let title: string;
	export let stepNumber: number;
</script>

<div class="card-primary">
	<div class="main-wrapper">
		<h4>{title}</h4>
		<Column gap={1.4} align="flex-start">
			<slot />
		</Column>
		<div class="edit-wrapper" on:click={() => generatorActiveStep.goToStep(stepNumber)}>
			<Icon icon="tabler:edit" color="var(--clr-primary-main)" />
		</div>
	</div>
</div>

<style type="scss">
	.main-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.8rem;

		h4 {
			font-size: var(--fs-400);
		}

		.edit-wrapper {
			position: absolute;
			top: 0;
			right: 0;
			cursor: pointer;
		}
	}
</style>
