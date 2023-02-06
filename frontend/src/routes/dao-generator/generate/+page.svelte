<!-- Page that dynamically renders each step of the DAO Generation process -->
<script>
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';
</script>

<svelte:component this={$generatorSteps[$generatorActiveStep].component} />
