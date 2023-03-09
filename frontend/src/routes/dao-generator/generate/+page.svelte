<!-- Page that dynamically renders each step of the DAO Generation process -->
<script>
	import { daoGeneratorSteps, generatorActiveStep } from '$lib/features/dao-generator/stores/DaoGeneratorSteps';
</script>

<svelte:component this={$daoGeneratorSteps[$generatorActiveStep].component} />
