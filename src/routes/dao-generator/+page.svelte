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
		{#if $generatorActiveStep > 0}
			<Button type="transparent" on:click={generatorActiveStep.decrement}>
				<Icon icon="tabler:arrow-left" />Back</Button
			>
		{:else}
			<div />
		{/if}
		{#if $generatorSteps[$generatorActiveStep].form}
			<Button form={$generatorSteps[$generatorActiveStep].slug} size="large">Next</Button>
		{:else}
			<Button on:click={generatorActiveStep.increment}>Next</Button>
		{/if}
	</div>
</Container>

<style type="scss">
	.step-buttons {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 2rem;
		gap: 2rem;
	}
</style>
