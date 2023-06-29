<script type="ts">
	import { InputWrapper } from '@emerald-dao/component-library';
	import { fly } from 'svelte/transition';
	import validationSuite from './validation';
	import StepButtons from '../../../components/atoms/StepButtons.svelte';
	import { onMount } from 'svelte';
	import { getContext } from 'svelte';
	import type { createSteps } from '$stores/custom/steps/Steps';
	import type { createActiveStep } from '$stores/custom/steps/ActiveStep';
	import type { daoGeneratorData as TdaoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
	import type { daoAndTokenGeneratorData } from '$lib/features/dao-generator/stores/DaoAndTokenGeneratorData';

	const daoGeneratorData: typeof TdaoGeneratorData | typeof daoAndTokenGeneratorData =
		getContext('daoGeneratorData');
	const generatorActiveStep: ReturnType<typeof createActiveStep> =
		getContext('daoGeneratorActiveStep');
	const daoGeneratorSteps: ReturnType<typeof createSteps> = getContext('daoGeneratorSteps');

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
