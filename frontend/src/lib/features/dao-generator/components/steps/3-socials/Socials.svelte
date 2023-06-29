<script type="ts">
	import { InputWrapper } from '@emerald-dao/component-library';
	import { fly } from 'svelte/transition';
	import validationSuite from './validation';
	import StepButtons from '../../../components/atoms/StepButtons.svelte';
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
		prefix="https://discord.gg/"
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
