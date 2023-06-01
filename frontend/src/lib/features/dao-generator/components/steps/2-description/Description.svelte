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

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = validationSuite($daoGeneratorData.daoDetails, target.name);
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
		name="longDescription"
		label="Long description"
		errors={res.getErrors('longDescription')}
		isValid={res.isValid('longDescription')}
		required={false}
	>
		<textarea
			name="longDescription"
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
