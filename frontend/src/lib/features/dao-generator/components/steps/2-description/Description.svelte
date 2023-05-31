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
	import { onMount } from 'svelte';

	const handleChange = () => {
		res = validationSuite($daoGeneratorData.daoDetails);
	};

	let res = validationSuite.get();

	let firstInput: HTMLTextAreaElement;

	onMount(() => {
		firstInput.focus();
	});
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
			class="description"
			placeholder="A DAO for the people"
			bind:value={$daoGeneratorData.daoDetails.description}
			on:input={handleChange}
			bind:this={firstInput}
		/>
	</InputWrapper>
	<InputWrapper
		name="long-description"
		label="Long description"
		errors={res.getErrors('long-description')}
		isValid={res.isValid('long-description')}
		required={false}
	>
		<textarea
			name="long-description"
			class="long-description"
			placeholder="Here you can write more information about your DAO! This text can be longer :)"
			bind:value={$daoGeneratorData.daoDetails.longDescription}
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
			max-width: 100%;
			min-width: 100%;

			&.description {
				height: 6rem;
			}

			&.long-description {
				height: 16rem;
			}
		}
	}
</style>
