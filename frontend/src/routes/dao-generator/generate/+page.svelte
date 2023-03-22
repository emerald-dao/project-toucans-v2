<!-- Page that dynamically renders each step of the DAO Generation process -->
<script>
	import {
		daoGeneratorSteps,
		generatorActiveStep
	} from '$lib/features/dao-generator/stores/DaoGeneratorSteps';
	import { onMount } from 'svelte';

	onMount(() => {
		generatorActiveStep.reset();
	});
</script>

<svelte:component this={$daoGeneratorSteps[$generatorActiveStep].component} />
