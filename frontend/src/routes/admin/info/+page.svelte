<script type="ts">
	import { fly } from 'svelte/transition';
	import type { Writable } from 'svelte/store';
	import { getContext, onMount } from 'svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button, InputWrapper } from '@emerald-dao/component-library';
	import validationSuite from './validation';
	import { applyAction, enhance } from '$app/forms';
	import IconCircle from '$components/atoms/IconCircle.svelte';

	export let form;

	const adminData: {
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	const userDaosStore = adminData.userDaos;

	$: activeDaoData = $userDaosStore[$activeDaoStore];

	let changesSubmmited = false;
	let submitionOnCourse = false;
	let formHasChanges = false;
	let formData = {
		website: '',
		twitter: '',
		discord: '',
		description: ''
	};

	onMount(() => populateFormData());

	const onSubmit = async () => {
		validationSuite.reset();
		res = validationSuite.get();

		submitionOnCourse = false;
		changesSubmmited = true;

		formData.website = (form?.website as string) ?? activeDaoData.generalInfo.website;
		formData.twitter = (form?.twitter as string) ?? activeDaoData.generalInfo.twitter;
		formData.discord = (form?.discord as string) ?? activeDaoData.generalInfo.discord;
		formData.description = (form?.description as string) ?? activeDaoData.generalInfo.description;
	};

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;
		formHasChanges = checkDataChanges();

		if (!formHasChanges) {
			resetValidation();
		} else {
			res = validationSuite(formData, target.name);
		}
	};

	const populateFormData = () => {
		formData.website = activeDaoData.generalInfo.website ? activeDaoData.generalInfo.website : '';
		formData.twitter = activeDaoData.generalInfo.twitter ? activeDaoData.generalInfo.twitter : '';
		formData.discord = activeDaoData.generalInfo.discord ? activeDaoData.generalInfo.discord : '';
		formData.description = activeDaoData.generalInfo.description;
	};

	const checkDataChanges = () => {
		if (activeDaoData) {
			return (
				formData.website !== activeDaoData.generalInfo.website ||
				formData.twitter !== activeDaoData.generalInfo.twitter ||
				formData.discord !== activeDaoData.generalInfo.discord ||
				formData.description !== activeDaoData.generalInfo.description
			);
		} else {
			return false;
		}
	};

	const resetValidation = () => {
		validationSuite.reset();
		res = validationSuite.get();
	};

	let res = validationSuite.get();

	$: activeDaoData && populateFormData();
	$: activeDaoData && (formHasChanges = checkDataChanges());
	$: activeDaoData && resetValidation();
</script>

<form
	method="POST"
	use:enhance={({ form }) => {
		submitionOnCourse = true;

		return async ({ result, update }) => {
			if (result.type === 'success') {
				await applyAction(result);
				onSubmit();
			}
			update();
		};
	}}
	in:fly={{ x: 10, duration: 400 }}
	autocomplete="off"
>
	<input type="hidden" name="project_id" hidden value={activeDaoData.generalInfo.project_id} />
	<InputWrapper
		name="description"
		label="Description"
		errors={res.getErrors('description')}
		isValid={res.isValid('description')}
	>
		<textarea
			name="description"
			placeholder="A DAO for the people"
			bind:value={formData.description}
			on:input={handleChange}
		/>
	</InputWrapper>
	<InputWrapper
		name="website"
		label="Website"
		errors={res.getErrors('website')}
		isValid={res.isValid('website') && formData.website.length > 0}
		prefix="https://"
		icon="tabler:world"
	>
		<input
			name="website"
			type="text"
			placeholder="ecdao.org"
			bind:value={formData.website}
			on:input={handleChange}
		/>
	</InputWrapper>
	<InputWrapper
		name="twitter"
		label="Twitter"
		errors={res.getErrors('twitter')}
		isValid={res.isValid('twitter') && formData.twitter.length > 0}
		prefix="@"
		icon="tabler:brand-twitter"
	>
		<input
			name="twitter"
			type="text"
			placeholder="emerald_dao"
			bind:value={formData.twitter}
			on:input={handleChange}
		/>
	</InputWrapper>
	<InputWrapper
		name="discord"
		label="Discord Invite"
		errors={res.getErrors('discord')}
		isValid={res.isValid('discord') && formData.discord.length > 0}
		prefix="https://discord.gg/invite/"
		icon="tabler:brand-discord"
	>
		<input
			name="discord"
			type="text"
			placeholder="emeraldcity"
			bind:value={formData.discord}
			on:input={handleChange}
		/>
	</InputWrapper>
	<div class="button-wrapper">
		<Button
			state={res.isValid() && formHasChanges && !submitionOnCourse
				? 'active'
				: submitionOnCourse
				? 'loading'
				: 'disabled'}
			size="large"
			width="extended">Submit</Button
		>
		{#if changesSubmmited}
			<span class="success-message row-2 align-center xsmall">
				<IconCircle icon="tabler:check" color="primary" />
				Succesfully updated
			</span>
		{/if}
	</div>
</form>

<style lang="scss">
	form {
		width: 40ch;

		textarea {
			height: 10rem;
			max-width: 100%;
			min-width: 100%;
		}

		.button-wrapper {
			display: flex;
			flex-direction: row-reverse;
			justify-content: space-between;
			margin-top: var(--space-5);

			.success-message {
				color: var(--clr-font-text);
			}
		}
	}
</style>
