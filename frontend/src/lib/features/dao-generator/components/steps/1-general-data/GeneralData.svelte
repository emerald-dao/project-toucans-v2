<script type="ts">
	import { InputWrapper, DropZone } from '@emerald-dao/component-library';
	import { fly } from 'svelte/transition';
	import StepButtons from '../../../components/atoms/StepButtons.svelte';
	import validationSuite, { type DaoProject } from './validation';
	import type { SuiteRunResult } from 'vest';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { network } from '$flow/config';
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

	export let validForm = false;

	let existingProjects: DaoProject[];

	onMount(async () => {
		const { data } = await supabase
			.from('projects')
			.select('name, token_symbol, project_id')
			.eq('network', network);

		if (data) {
			existingProjects = data;
		} else {
			console.error('Error fetching projects');
			goto('/404');
		}
	});

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		if (target.name === 'name') {
			$daoGeneratorData.daoDetails.contractName = $daoGeneratorData.daoDetails.name.replace(
				/[^\w\s]|\s/gi,
				''
			);

			namePending = true;
			contractNamePending = true;
		}

		if (target.name === 'contractName') {
			$daoGeneratorData.daoDetails.contractName = $daoGeneratorData.daoDetails.contractName.replace(
				/[^\w\s]|\s/gi,
				''
			);

			contractNamePending = true;
		}

		if (target.name === 'tokenName' && $daoGeneratorData.daoDetails.daoType === 'daoAndToken') {
			$daoGeneratorData.daoDetails.tokenName = $daoGeneratorData.daoDetails.tokenName.toUpperCase();
			tokenNamePending = true;
		}

		res = validationSuite($daoGeneratorData.daoDetails, existingProjects, target.name);

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

	let firstInput: HTMLInputElement;

	onMount(() => {
		firstInput.focus();
	});

	$: if ($daoGeneratorData.daoDetails.name) {
	}

	$: if ($daoGeneratorData.daoDetails.daoType === 'daoAndToken')
		$daoGeneratorData.daoDetails.tokenName = $daoGeneratorData.daoDetails.tokenName
			.toUpperCase()
			.replace(/[^A-Z]/g, '');

	$: validForm =
		res.isValid() &&
		$daoGeneratorData.daoDetails.logo != undefined &&
		$daoGeneratorData.daoDetails.logo.length > 0 &&
		$daoGeneratorData.daoDetails.bannerImage != undefined &&
		$daoGeneratorData.daoDetails.bannerImage.length > 0;
</script>

<form
	id={$daoGeneratorSteps[$generatorActiveStep].slug}
	on:submit|preventDefault={generatorActiveStep.increment}
	autocomplete="off"
	in:fly={{ y: 30, duration: 400 }}
>
	<InputWrapper
		name="name"
		label="DAO Name"
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
			bind:this={firstInput}
		/>
	</InputWrapper>
	{#if $daoGeneratorData.daoDetails.daoType === 'daoAndToken'}
		<InputWrapper
			name="contractName"
			label="Contract Name"
			pending={contractNamePending}
			pendingMessage={contractNamePendingMessage}
			errors={res.getErrors('contractName')}
			isValid={res.isValid('contractName')}
			required={true}
		>
			<input
				type="text"
				name="contractName"
				placeholder="EmeraldToken"
				maxlength="30"
				bind:value={$daoGeneratorData.daoDetails.contractName}
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
	{/if}
	<div class="drop-zone-wrapper">
		<label for="logo">Logo *</label>
		<DropZone
			name="logo"
			accept={['image/png', 'image/jpeg', 'image/jpg']}
			maxAmountOfFiles={1}
			bind:bindValue={$daoGeneratorData.daoDetails.logo}
		/>
	</div>
	<div class="drop-zone-wrapper">
		<label for="banner">Banner Image *</label>
		<DropZone
			name="banner"
			accept={['image/png', 'image/jpeg', 'image/jpg']}
			maxAmountOfFiles={1}
			bind:bindValue={$daoGeneratorData.daoDetails.bannerImage}
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
