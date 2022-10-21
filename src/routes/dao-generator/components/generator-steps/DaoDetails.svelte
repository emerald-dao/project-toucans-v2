<script type="ts">
	import StepButtons from './atoms/StepButtons.svelte';
	import { Button } from '@emerald-dao/component-library';
	import InputWrapper from '$lib/components/forms/InputWrapper.svelte';
	import { daoData } from '$stores/generator/DaoDataStore';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';
	import daoDetailsSuite from '$lib/validations/daoDetailsSuite';
	import Icon from '@iconify/svelte';

	const handleChange = (input) => {
		res = daoDetailsSuite($daoData.daoDetails, input.target.name);

		if (input.target.name === 'name') {
			namePending = true;
		}

		res.done((result) => {
			res = result;
			namePending = false;
		});
	};

	let namePending: boolean;
	let namePendingMessage = ['Checking if name already exists in the blockchain...'];

	let res = daoDetailsSuite.get();
</script>

<form
	id={$generatorSteps[$generatorActiveStep].slug}
	on:submit|preventDefault={generatorActiveStep.increment}
	autocomplete="off"
>
	<InputWrapper
		name="name"
		label="What should we call this DAO?"
		pending={namePending}
		pendingMessage={namePendingMessage}
		{res}
	>
		<input
			name="name"
			type="text"
			placeholder="Emerald DAO"
			bind:value={$daoData.daoDetails.name}
			on:input={handleChange}
		/>
	</InputWrapper>

	<InputWrapper name="tokenName" label="Token Name" icon="tabler:currency-dollar" {res}>
		<input
			name="tokenName"
			type="text"
			placeholder="DAOcoin"
			bind:value={$daoData.daoDetails.tokenName}
			on:input={handleChange}
		/>
	</InputWrapper>

	<InputWrapper name="description" label="Description" {res}>
		<textarea
			name="description"
			placeholder="A DAO for the people"
			bind:value={$daoData.daoDetails.description}
			on:input={handleChange}
		/>
	</InputWrapper>

	<InputWrapper name="website" label="Website" icon="tabler:world" {res}>
		<input
			name="website"
			type="text"
			placeholder="alphadao.com"
			bind:value={$daoData.daoDetails.website}
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
			font-size: var(--fs-300);
		}
	}
</style>
