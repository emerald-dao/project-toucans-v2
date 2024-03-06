<script type="ts">
	import { InputWrapper } from '@emerald-dao/component-library';
	import { fly } from 'svelte/transition';
	import validationSuite from './validation';
	import { onMount } from 'svelte';
	import { votingGeneratorGeneralData } from '../../../votingGeneratorData';
	import { votingGeneratorActiveStep } from '../../../votingGeneratorSteps';
	import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from '../../../votingGeneratorConfig';
	import type { SuiteRunResult } from 'vest';

	export let isValid = false;

	const handleChange = () => {
		res = validationSuite(
			$votingGeneratorGeneralData.name,
			$votingGeneratorGeneralData.description
		);

		(res as SuiteRunResult).done(() => {
			isValid = res.isValid();
		});
	};

	let res = validationSuite.get();

	let firstInput: HTMLInputElement;

	onMount(() => {
		firstInput.focus();
	});
</script>

<form
	id="votation-general-data-form"
	on:submit|preventDefault={votingGeneratorActiveStep.increment}
	autocomplete="off"
	in:fly={{ y: 30, duration: 400 }}
>
	<InputWrapper
		name="title"
		label="Votation title"
		errors={res.getErrors('title')}
		isValid={res.isValid('title')}
		required={true}
	>
		<input
			name="title"
			type="text"
			placeholder="New logo for Emerald City"
			maxlength={TITLE_MAX_LENGTH}
			bind:value={$votingGeneratorGeneralData.name}
			on:input={handleChange}
			bind:this={firstInput}
		/>
	</InputWrapper>
	<InputWrapper
		name="description"
		label="Votation description"
		errors={res.getErrors('description')}
		isValid={res.isValid('description')}
		required={true}
	>
		<textarea
			name="description"
			placeholder="This is a description for the votation"
			rows="2"
			maxlength={DESCRIPTION_MAX_LENGTH}
			bind:value={$votingGeneratorGeneralData.description}
			on:input={handleChange}
		/>
	</InputWrapper>
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;
	}

	textarea {
		border: none;
	}
</style>
