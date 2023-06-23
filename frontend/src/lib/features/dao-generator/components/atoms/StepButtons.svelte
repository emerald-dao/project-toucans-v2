<script type="ts">
	import Icon from '@iconify/svelte';
	import { Button } from '@emerald-dao/component-library';
	import { getContext } from 'svelte';
	import type { createSteps } from '$stores/custom/steps/Steps';
	import type { createActiveStep } from '$stores/custom/steps/ActiveStep';

	const generatorActiveStep: ReturnType<typeof createActiveStep> =
		getContext('daoGeneratorActiveStep');
	const daoGeneratorSteps: ReturnType<typeof createSteps> = getContext('daoGeneratorSteps');

	export let active: boolean = true;

	let finalLoading: boolean = false;

	function increment() {
		if ($generatorActiveStep === $daoGeneratorSteps.length - 1) {
			finalLoading = true;
		}
		generatorActiveStep.increment();
	}
</script>

<div class="step-buttons">
	{#if $generatorActiveStep > 0}
		<Button type="transparent" size="small" on:click={generatorActiveStep.decrement}>
			<Icon icon="tabler:arrow-left" />Back</Button
		>
	{:else}
		<div />
	{/if}
	<Button
		on:click={increment}
		size="large"
		state={finalLoading ? 'loading' : active ? 'active' : 'disabled'}
	>
		{#if $generatorActiveStep === $daoGeneratorSteps.length - 1}
			Generate DAO
		{:else}
			Next<Icon icon="tabler:arrow-right" />
		{/if}
	</Button>
</div>

<style type="scss">
	.step-buttons {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 2rem;
	}
</style>
