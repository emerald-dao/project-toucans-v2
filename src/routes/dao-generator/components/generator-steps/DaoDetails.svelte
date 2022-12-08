<script type="ts">
	import StepButtons from './atoms/StepButtons.svelte';
	import { InputWrapper, DropZone } from '@emerald-dao/component-library';
	import { daoData } from '$stores/generator/DaoDataStore';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';
	import daoDetailsSuite from '$lib/validations/daoDetailsSuite';

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = daoDetailsSuite($daoData.daoDetails, target.name);

		if (target.name === 'name') {
			namePending = true;
		}

		if (target.name === 'tokenName') {
			tokenNamePending = true;
		}

		res.done((result) => {
			res = result;
			namePending = false;
			tokenNamePending = false;
		});
	};

	let namePending: boolean;
	let namePendingMessage = ['Checking if name already exists in Flow blockchain...'];
	let tokenNamePending: boolean;
	let tokenNamePendingMessage = ['Checking if token name already exists in Flow blockchain...'];

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
		errors={res.getErrors('name')}
		isValid={res.isValid('name')}
	>
		<input
			name="name"
			type="text"
			placeholder="Emerald DAO"
			bind:value={$daoData.daoDetails.name}
			on:input={handleChange}
		/>
	</InputWrapper>

	<InputWrapper
		name="tokenName"
		label="Token Name"
		icon="tabler:currency-dollar"
		pending={tokenNamePending}
		pendingMessage={tokenNamePendingMessage}
		errors={res.getErrors('tokenName')}
		isValid={res.isValid('tokenName')}
		tooltip="Add any helper text here"
	>
		<input
			name="tokenName"
			type="text"
			placeholder="DAOcoin"
			bind:value={$daoData.daoDetails.tokenName}
			on:input={handleChange}
		/>
	</InputWrapper>

	<InputWrapper
		name="description"
		label="Description"
		errors={res.getErrors('description')}
		isValid={res.isValid('description')}
	>
		<textarea
			name="description"
			placeholder="A DAO for the people"
			bind:value={$daoData.daoDetails.description}
			on:input={handleChange}
		/>
	</InputWrapper>

	<InputWrapper
		name="website"
		label="Website"
		icon="tabler:world"
		errors={res.getErrors('website')}
		isValid={res.isValid('website')}
	>
		<input
			name="website"
			type="text"
			placeholder="alphadao.com"
			bind:value={$daoData.daoDetails.website}
			on:input={handleChange}
		/>
	</InputWrapper>

	<label for="logo">Logo</label>
	<DropZone
		name="logo"
		accept="image/png"
		amountOfFiles={1}
		bind:bindValue={$daoData.daoDetails.logo}
	/>

	<StepButtons active={res.isValid()} />
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;

		textarea {
			min-height: 15rem;
		}
	}
</style>
