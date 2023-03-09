<script type="ts">
	import { InputWrapper } from '@emerald-dao/component-library';
	import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
	import {
		daoGeneratorSteps,
		generatorActiveStep
	} from '$lib/features/dao-generator/stores/DaoGeneratorSteps';
	import { fly } from 'svelte/transition';
	import validationSuite from './validation';
	import StepButtons from '../../../components/atoms/StepButtons.svelte';

	const handleChange = () => {
		res = validationSuite($daoGeneratorData.daoDetails);
	};

	let res = validationSuite.get();
</script>

<form
	id={$daoGeneratorSteps[$generatorActiveStep].slug}
	on:submit|preventDefault={generatorActiveStep.increment}
	autocomplete="off"
	in:fly={{ y: 30, duration: 400 }}
>
	<InputWrapper
		name="description"
		label="Description"
		errors={res.getErrors('description')}
		isValid={res.isValid('description')}
		required={true}
	>
		<textarea
			name="description"
			placeholder="A DAO for the people"
			bind:value={$daoGeneratorData.daoDetails.description}
			on:input={handleChange}
		/>
	</InputWrapper>
	<StepButtons active={res.isValid()} />
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;

		textarea {
			min-height: 15rem;
			max-width: 100%;
			min-width: 100%;
		}
	}
</style>
