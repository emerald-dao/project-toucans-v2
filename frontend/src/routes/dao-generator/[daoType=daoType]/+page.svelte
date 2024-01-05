<!-- Page that dynamically renders each step of the DAO Generation process -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { getContext } from 'svelte';
	import type { createSteps } from '$stores/custom/steps/Steps';
	import type { createActiveStep } from '$stores/custom/steps/ActiveStep';

	const generatorActiveStep: ReturnType<typeof createActiveStep> =
		getContext('daoGeneratorActiveStep');
	const daoGeneratorSteps: ReturnType<typeof createSteps> = getContext('daoGeneratorSteps');

	onMount(() => {
		generatorActiveStep.reset();
	});
</script>

<svelte:component this={$daoGeneratorSteps[$generatorActiveStep].component} />
