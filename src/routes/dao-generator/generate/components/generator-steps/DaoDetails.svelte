<script type="ts">
	import DaoDetailsForm from '$lib/components/forms/DaoDetailsForm.svelte';
	import StepButtons from './atoms/StepButtons.svelte';
	import { InputWrapper, DropZone } from '@emerald-dao/component-library';
	import { daoData } from '$stores/generator/DaoDataStore';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';
	import daoDetailsSuite from '$lib/validations/daoDetailsSuite';
</script>

<DaoDetailsForm />
<StepButtons active={true} />
