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

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = validationSuite($daoGeneratorData.daoDetails, target.name);
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
		name="website"
		label="Website"
		errors={res.getErrors('website')}
		isValid={res.isValid('website') && $daoGeneratorData.daoDetails.website.length > 0}
		prefix="https://"
		icon="tabler:world"
	>
		<input
			name="website"
			type="text"
			placeholder="ecdao.org"
			bind:value={$daoGeneratorData.daoDetails.website}
			on:input={handleChange}
		/>
	</InputWrapper>
	<InputWrapper
		name="twitter"
		label="Twitter"
		errors={res.getErrors('twitter')}
		isValid={res.isValid('twitter') && $daoGeneratorData.daoDetails.twitter.length > 0}
		prefix="@"
		icon="tabler:brand-twitter"
	>
		<input
			name="twitter"
			type="text"
			placeholder="emerald_dao"
			bind:value={$daoGeneratorData.daoDetails.twitter}
			on:input={handleChange}
		/>
	</InputWrapper>
	<InputWrapper
		name="discord"
		label="Discord Invite"
		errors={res.getErrors('discord')}
		isValid={res.isValid('discord')}
		prefix="https://discord.gg/invite/"
		icon="tabler:brand-discord"
	>
		<input
			name="discord"
			type="text"
			placeholder="emeraldcity"
			bind:value={$daoGeneratorData.daoDetails.discord}
			on:input={handleChange}
		/>
	</InputWrapper>
	<StepButtons />
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;
	}
</style>
