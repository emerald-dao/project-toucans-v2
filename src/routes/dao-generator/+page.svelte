<!-- Page that dynamically renders each step of the DAO Generation process -->
<script>
	import { Section, Container, Row, Column } from '@mateoroldos/svelte.bones';
	import { Button } from '@emerald-dao/component-library';
	import { activeStep } from '$lib/stores/generator/ActiveStep';
	import { steps } from '$stores/generator/StepsStore';
	import Icon from '@iconify/svelte';
</script>

<Container width="small" --container-s="34ch">
	<svelte:component this={$steps[$activeStep].component} />
	<div class="step-buttons">
		<Button type="transparent" on:click={activeStep.decrement}>
			<Icon icon="tabler:arrow-narrow-left" />Back</Button
		>
		<Button on:click={activeStep.increment}>Next</Button>
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
