<script type="ts">
	import { onMount } from 'svelte';
	import { Button, InputWrapper, DropZone } from '@emerald-dao/component-library';
	import validationSuite from './validation';
	import { applyAction, enhance } from '$app/forms';
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import * as AdminPage from '../_components/admin-page';

	export let data;
	export let form;

	let changesSubmmited = false;
	let submitionOnCourse = false;
	let formHasChanges = false;
	let formData = {
		website: '',
		twitter: '',
		discord: '',
		name: '',
		description: '',
		long_description: '',
		logo: [],
		bannerImage: []
	};

	onMount(() => populateFormData());

	const onSubmit = async () => {
		validationSuite.reset();
		res = validationSuite.get();

		submitionOnCourse = false;
		changesSubmmited = true;

		formData.website = (form?.website as string) ?? data.activeDao.generalInfo.website;
		formData.twitter = (form?.twitter as string) ?? data.activeDao.generalInfo.twitter;
		formData.discord = (form?.discord as string) ?? data.activeDao.generalInfo.discord;
		formData.name = (form?.name as string) ?? data.activeDao.generalInfo.name;
		formData.description = (form?.description as string) ?? data.activeDao.generalInfo.description;
		formData.long_description =
			(form?.long_description as string) ?? data.activeDao.generalInfo.long_description;
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
		formData.website = data.activeDao.generalInfo.website ? data.activeDao.generalInfo.website : '';
		formData.twitter = data.activeDao.generalInfo.twitter ? data.activeDao.generalInfo.twitter : '';
		formData.name = data.activeDao.generalInfo.name ? data.activeDao.generalInfo.name : '';
		formData.discord = data.activeDao.generalInfo.discord ? data.activeDao.generalInfo.discord : '';
		formData.description = data.activeDao.generalInfo.description;
		formData.long_description = data.activeDao.generalInfo.long_description
			? data.activeDao.generalInfo.long_description
			: '';
	};

	const checkDataChanges = () => {
		if (data.activeDao) {
			return (
				formData.website !== data.activeDao.generalInfo.website ||
				formData.twitter !== data.activeDao.generalInfo.twitter ||
				formData.discord !== data.activeDao.generalInfo.discord ||
				formData.name !== data.activeDao.generalInfo.name ||
				formData.description !== data.activeDao.generalInfo.description ||
				formData.long_description !== data.activeDao.generalInfo.long_description ||
				formData.logo.length > 0 ||
				formData.bannerImage.length > 0
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

	$: data.activeDao && populateFormData();
	$: data.activeDao && formData && (formHasChanges = checkDataChanges());
	$: data.activeDao && resetValidation();
</script>

<AdminPage.Root>
	<AdminPage.Header>
		<AdminPage.Title>General Info</AdminPage.Title>
		<AdminPage.Description>Update the general information of your DAO.</AdminPage.Description>
	</AdminPage.Header>
	<AdminPage.Container grid={false}>
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
			autocomplete="off"
		>
			<div>
				<input
					type="hidden"
					name="project_id"
					hidden
					value={data.activeDao.generalInfo.project_id}
				/>
				<InputWrapper
					name="name"
					label="Name"
					errors={res.getErrors('name')}
					isValid={res.isValid('name')}
				>
					<input
						name="name"
						type="text"
						placeholder="A DAO for the people"
						bind:value={formData.name}
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
						class="description"
						placeholder="A DAO for the people"
						bind:value={formData.description}
						on:input={handleChange}
					/>
				</InputWrapper>
				<InputWrapper
					name="longDescription"
					label="Long description"
					errors={res.getErrors('longDescription')}
					isValid={res.isValid('longDescription')}
				>
					<textarea
						name="longDescription"
						class="long-description"
						placeholder="Here you can get creative and write a longer description :)"
						bind:value={formData.long_description}
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
					prefix="https://discord.gg/"
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
			</div>
			<div class="column-7">
				<div class="drop-zone-wrapper">
					<label for="logo">Drop a new logo</label>
					<DropZone
						name="logo"
						accept={['image/png', 'image/jpeg', 'image/jpg']}
						maxAmountOfFiles={1}
						bind:bindValue={formData.logo}
					/>
				</div>
				<div class="drop-zone-wrapper">
					<label for="banner">Drop a new banner image</label>
					<DropZone
						name="banner"
						accept={['image/png', 'image/jpeg', 'image/jpg']}
						maxAmountOfFiles={1}
						bind:bindValue={formData.bannerImage}
					/>
				</div>
			</div>
			<div class="button-wrapper">
				<Button
					state={!res.hasErrors() && formHasChanges && !submitionOnCourse
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
	</AdminPage.Container>
</AdminPage.Root>

<style lang="scss">
	form {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: 1fr auto;
		column-gap: var(--space-13);
		grid-gap: var(--space-7);
		grid-template-areas:
			'left right'
			'button button';

		textarea {
			max-width: 100%;
			min-width: 100%;

			&.description {
				height: 4rem;
			}

			&.long-description {
				height: 7rem;
			}
		}

		.button-wrapper {
			display: flex;
			flex-direction: row-reverse;
			justify-content: space-between;
			margin-top: var(--space-5);
			grid-area: button;

			.success-message {
				color: var(--clr-font-text);
			}
		}
	}
</style>
