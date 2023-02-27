<script type="ts">
	import { InputWrapper, DropZone } from '@emerald-dao/component-library';
	import { daoGeneratorData } from '$stores/generator/DaoDataStore';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';
	import daoDetailsSuite from '$lib/validations/daoDetailsSuite';
	import { page } from '$app/stores';

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

		res = daoDetailsSuite($daoGeneratorData.daoDetails, target.name, $page.data.data.body);

		res.done((result) => {
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
	let contractNamePendingMessage = ['Checking if contract name already exists in Flow blockchain...'];

	let res = daoDetailsSuite.get();

	$: $daoGeneratorData.daoDetails.contractName = $daoGeneratorData.daoDetails.name.replace(/[^\w\s]|\s/gi, '').toLowerCase();

	$: validForm = res.isValid() && $daoGeneratorData.daoDetails.logo ? $daoGeneratorData.daoDetails.logo.length > 0 : false;	
</script>

<form
	id={$generatorSteps[$generatorActiveStep].slug}
	on:submit|preventDefault={generatorActiveStep.increment}
	autocomplete="off"
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
		<input type="text" readonly name="contractName" placeholder="emeralddao" bind:value={$daoGeneratorData.daoDetails.contractName} />
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
		accept="image/png"
		maxAmountOfFiles={1}
		bind:bindValue={$daoGeneratorData.daoDetails.logo}
		/>
	</div>

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

	<InputWrapper
		name="website"
		label="Website"
		icon="tabler:world"
		errors={res.getErrors('website')}
		isValid={res.isValid('website') && $daoGeneratorData.daoDetails.website.length > 0}
	>
		<input
			name="website"
			type="text"
			placeholder="alphadao.com"
			bind:value={$daoGeneratorData.daoDetails.website}
			on:input={handleChange}
		/>
	</InputWrapper>

	<InputWrapper
		name="twitter"
		label="Twitter"
		icon="tabler:brand-twitter"
		errors={res.getErrors('twitter')}
		isValid={res.isValid('twitter') && $daoGeneratorData.daoDetails.twitter.length > 0}
	>
		<input
			name="twitter"
			type="text"
			placeholder="@emerald_dao"
			bind:value={$daoGeneratorData.daoDetails.twitter}
			on:input={handleChange}
		/>
	</InputWrapper>

	<InputWrapper
		name="discord"
		label="Discord invite"
		icon="tabler:brand-discord"
		errors={res.getErrors('discord')}
		isValid={res.isValid('discord') && $daoGeneratorData.daoDetails.discord !==	'https://discord.gg/'}
	>
		<input
			name="discord"
			type="text"
			placeholder="https://discord.gg/emeraldcity"
			bind:value={$daoGeneratorData.daoDetails.discord}
			on:input={handleChange}
		/>
	</InputWrapper>
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;

		.drop-zone-wrapper {
			margin-bottom: var(--space-7);
		}

		textarea {
			min-height: 15rem;
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
