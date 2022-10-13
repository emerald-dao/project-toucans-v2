<!-- Page that dynamically renders each step of the DAO Generation process -->
<script>
	import { Container } from '@mateoroldos/svelte.bones';
	import { Button } from '@emerald-dao/component-library';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';
	import Icon from '@iconify/svelte';
</script>

<Container width="small" --container-s="34ch">
	<svelte:component this={$generatorSteps[$generatorActiveStep].component} />
	<div class="step-buttons">
		<Button type="transparent" on:click={generatorActiveStep.decrement}>
			<Icon icon="tabler:arrow-narrow-left" />Back</Button
		>
		<Button on:click={generatorActiveStep.increment}>Next</Button>
		<!-- <Button on:click={activeStep.reset}>Reset</Button> -->
	</div>
</Container>

<style type="scss">
	.step-buttons {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 2rem;
	}
</style>
