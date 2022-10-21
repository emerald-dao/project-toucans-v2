<!-- Page that dynamically renders each step of the DAO Generation process -->
<script>
	import { Button } from '@emerald-dao/component-library';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';
	import Icon from '@iconify/svelte';
</script>

<svelte:component this={$generatorSteps[$generatorActiveStep].component} />
