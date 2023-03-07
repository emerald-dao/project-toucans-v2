<script type="ts">
	import { InputWrapper, DropZone } from '@emerald-dao/component-library';
	import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
	import {
		daoGeneratorSteps,
		generatorActiveStep
	} from '$lib/features/dao-generator/stores/DaoGeneratorSteps';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';
	import StepButtons from '../../../components/atoms/StepButtons.svelte';
	import validationSuite from './validation';
	import type { SuiteRunResult } from 'vest';

	export let validForm = false;

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		if (target.name === 'name') {
			namePending = true;
			contractNamePending = true;
		}

		if (target.name === 'tokenName') {
			$daoGeneratorData.daoDetails.tokenName = $daoGeneratorData.daoDetails.tokenName.toUpperCase();
			tokenNamePending = true;
		}

		res = validationSuite($daoGeneratorData.daoDetails, target.name, $page.data.data.body);

		(res as SuiteRunResult).done((result) => {
			res = result;
			namePending = false;
			contractNamePending = false;
			tokenNamePending = false;
		});
	};

	let namePending: boolean;
	let namePendingMessage = ['Checking if name already exists in Flow blockchain...'];
	let tokenNamePending: boolean;
	let tokenNamePendingMessage = ['Checking if token name already exists in Flow blockchain...'];
	let contractNamePending: boolean;
	let contractNamePendingMessage = [
		'Checking if contract name already exists in Flow blockchain...'
	];

	let res = validationSuite.get();

	$: $daoGeneratorData.daoDetails.contractName = $daoGeneratorData.daoDetails.name
		.replace(/[^\w\s]|\s/gi, '')
		.toLowerCase();

	$: validForm =
		res.isValid() && $daoGeneratorData.daoDetails.logo
			? $daoGeneratorData.daoDetails.logo.length > 0
			: false;
</script>

<form
	id={$daoGeneratorSteps[$generatorActiveStep].slug}
	on:submit|preventDefault={generatorActiveStep.increment}
	autocomplete="off"
	in:fly={{ y: 30, duration: 400 }}
>
	<InputWrapper
		name="name"
		label="DAO name"
		pending={namePending}
		pendingMessage={namePendingMessage}
		errors={res.getErrors('name')}
		isValid={res.isValid('name')}
		required={true}
	>
		<input
			name="name"
			type="text"
			placeholder="Emerald DAO"
			maxlength="30"
			bind:value={$daoGeneratorData.daoDetails.name}
			on:input={handleChange}
		/>
	</InputWrapper>
	<InputWrapper
		name="contractName"
		label="Contract name"
		pending={contractNamePending}
		pendingMessage={contractNamePendingMessage}
		errors={res.getErrors('contractName')}
		isValid={res.isValid('contractName')}
		required={true}
	>
		<input
			type="text"
			readonly
			name="contractName"
			placeholder="emeralddao"
			bind:value={$daoGeneratorData.daoDetails.contractName}
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
		required={true}
	>
		<input
			name="tokenName"
			type="text"
			placeholder="EMLD"
			maxlength="5"
			bind:value={$daoGeneratorData.daoDetails.tokenName}
			on:input={handleChange}
		/>
	</InputWrapper>
	<div class="drop-zone-wrapper">
		<label for="logo">Logo *</label>
		<DropZone
			name="logo"
			accept={['image/png', 'image/jpeg', 'image/jpg']}
			maxAmountOfFiles={1}
			bind:bindValue={$daoGeneratorData.daoDetails.logo}
		/>
	</div>
	<StepButtons active={validForm} />
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;

		.drop-zone-wrapper {
			margin-bottom: var(--space-7);
		}

		input:read-only {
			cursor: not-allowed;
			color: var(--clr-text-off);

			&:focus {
				border: 1px var(--clr-border-primary) solid;
			}
		}
	}
</style>