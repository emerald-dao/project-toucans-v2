<script lang="ts">
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import { user } from '$stores/flow/FlowStore';
	import { Button, InputWrapper } from '@emerald-dao/component-library';
	import { writable, derived, type Writable } from 'svelte/store';
	import { fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Profile, ProfileTypes } from '$lib/types/common/profile.interface';
	import { fetchAllUserProfiles } from './fetchAllUserProfiles';
	import validationSuite from './validation';
	import type { SuiteRunResult } from 'vest';

	export let form;

	let isUploading = false;
	let errorMessage = '';

	interface UserProfiles {
		profiles: { [key in ProfileTypes]: Profile | null };
		useFind: boolean;
	}

	let allUserProfiles: Promise<UserProfiles> | null = null;

	$: allUserProfiles = $user.addr
		? fetchAllUserProfiles($user.addr).then((p) => {
				inputUseFind.set(p.useFind);
				inputProfileName.set(p.profiles.toucans?.name ?? '');

				return p;
		  })
		: null;

	let fileInput: HTMLInputElement;

	const inputImage: Writable<FileList> = writable();
	const inputUseFind = writable(false);
	const inputProfileName = writable('');

	const getImage = (node: HTMLImageElement, userProfiles: UserProfiles) => {
		const imageToDisplay = derived([inputImage, inputUseFind], ([$inputImage, $inputUseFind]) => {
			if ($inputUseFind) {
				return (
					(userProfiles.profiles.find?.avatar as string) ??
					(userProfiles.profiles.random?.avatar as string)
				);
			}

			if ($inputImage && $inputImage.length > 0) {
				return URL.createObjectURL($inputImage[0]);
			}

			if (userProfiles.profiles.toucans?.avatar) {
				return userProfiles.profiles.toucans?.avatar;
			}

			return '/profile-placeholder.jpg';
		});

		const unsubscribe = imageToDisplay.subscribe((value) => {
			node.src = value;
		});

		return {
			destroy: () => unsubscribe()
		};
	};

	let res = validationSuite.get();
	let userNamePending = false;

	let isResValid = writable(false);
	$: isResValid.set(res.isValid('user-name'));

	const handleInputChange = () => {
		res = validationSuite($inputProfileName);

		userNamePending = true;

		(res as SuiteRunResult).done((result) => {
			res = result;
			userNamePending = false;
		});
	};

	const dataHasChanges = derived(
		[inputImage, inputUseFind, inputProfileName],
		async ([$inputImage, $inputUseFind, $inputProfileName]) => {
			const userProfiles = await allUserProfiles;

			if (userProfiles !== null) {
				if ($inputUseFind) {
					return $inputUseFind !== userProfiles.useFind;
				}

				return (
					($inputImage && $inputImage.length > 0) ||
					$inputProfileName !== userProfiles.profiles.toucans?.name ||
					$inputUseFind !== userProfiles.useFind
				);
			}

			return false;
		}
	);

	const canUpdateProfile = derived(
		[dataHasChanges, inputUseFind, isResValid],
		async ([$dataHasChanges, $inputUseFind, $isResValid]) => {
			const userProfiles = await allUserProfiles;

			if (userProfiles !== null) {
				return (
					!isUploading &&
					(await $dataHasChanges) &&
					($inputUseFind
						? true
						: ($isResValid || userProfiles.profiles.toucans?.name === $inputProfileName) &&
						  (userProfiles.profiles.toucans?.avatar || ($inputImage && $inputImage.length > 0)))
				);
			}

			return false;
		}
	);
</script>

{#if !$user.addr}
	<ConnectPage />
{:else}
	<section class="container-small column-6">
		<div class="card column-2">
			<div class="padding-x">
				<h1>Edit avatar</h1>
			</div>
			{#await allUserProfiles}
				<div class="loading-card padding-x">
					<Icon
						icon="svg-spinners:ring-resize"
						width="30px"
						height="30px"
						color="var(--clr-text-off)"
					/>
				</div>
			{:then allProfiles}
				{#if allProfiles === null}
					<div class="padding-x">
						<span>Could not load profiles</span>
					</div>
				{:else}
					<div class="card-header padding-x">
						<span class="wallet-address">
							<Icon icon="tabler:wallet" inline />
							{$user.addr}
						</span>
					</div>

					<form
						method="POST"
						class="column-4 align-center padding-x"
						autocomplete="off"
						use:enhance={() => {
							isUploading = true;

							return async ({ result, update }) => {
								if (result.type === 'success') {
									await update({ reset: false });
									isUploading = false;
								}

								if (result.type === 'failure') {
									if (typeof result.data?.error === 'string') {
										errorMessage = result.data.error;
									} else {
										errorMessage = 'An error occurred';
									}

									isUploading = false;
								}
							};
						}}
					>
						<div class="image-wrapper">
							<img use:getImage={allProfiles} alt="User avatar" />
							{#if !$inputUseFind}
								<button
									type="button"
									on:click={() => {
										fileInput.click();
									}}
									transition:fly|local={{ duration: 300, easing: quintOut, y: 5 }}
								>
									<Icon icon="tabler:edit" inline width="14px" />
								</button>
								<input
									type="file"
									bind:this={fileInput}
									class="hidden"
									bind:files={$inputImage}
									accept="image/png, image/jpeg"
									multiple={false}
									name="user-avatar"
								/>
							{/if}
						</div>

						{#if allProfiles.profiles.find}
							<div class="use-find-wrapper">
								<label for="use-find" class="switch">
									<input
										type="checkbox"
										name="use-find"
										id="use-find"
										bind:checked={$inputUseFind}
									/>
									<span class="slider" />
									Use .find profile
								</label>
							</div>
						{/if}

						<input type="hidden" name="user" value={JSON.stringify($user)} />

						<div class="inputs-wrapper column-4">
							<div>
								<label for="user-name" class="username-label">Username</label>
								{#if !$inputUseFind}
									<div class="column-1" in:slide|local={{ duration: 500, easing: quintOut }}>
										<InputWrapper
											name="user-name"
											pending={userNamePending}
											pendingMessage={['Checking username availability']}
											errors={res.getErrors('user-name')}
											isValid={res.isValid('user-name')}
										>
											<input
												type="text"
												name="user-name"
												id="user-name"
												disabled={$inputUseFind}
												bind:value={$inputProfileName}
												on:input={() => handleInputChange()}
											/>
										</InputWrapper>
									</div>
								{:else if allProfiles.profiles.find}
									<div in:slide|local={{ duration: 500, easing: quintOut }} class="column-1">
										<span class="find-name w-medium large">{allProfiles.profiles.find.name}</span>
									</div>
								{/if}
							</div>
							{#await $canUpdateProfile then canUpdate}
								<Button
									color="neutral"
									size="small"
									width="full-width"
									state={isUploading ? 'loading' : canUpdate ? 'active' : 'disabled'}
								>
									{#if isUploading}
										Updating
									{:else}
										Update avatar
									{/if}
								</Button>
							{/await}
						</div>

						{#if form?.success}
							<p class="success small">
								<Icon icon="tabler:check" inline />
								Profile succesfully updated
							</p>
						{:else if errorMessage}
							<p class="error small">
								<Icon icon="tabler:alert-triangle" inline />
								{errorMessage}
							</p>
						{/if}
					</form>
				{/if}
			{/await}
		</div>
	</section>
{/if}

<style lang="scss">
	section {
		display: flex;
		align-items: center;

		.card {
			background-color: var(--clr-surface-primary);
			max-width: 350px;
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: var(--space-8) 0;

			.padding-x {
				padding: 0 var(--space-8);
			}

			h1 {
				font-size: var(--font-size-5);
				text-align: center;
				margin-bottom: 0;
			}

			.loading-card {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 300px;
			}

			.card-header {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: var(--space-3);
				border-bottom: 1px solid var(--clr-neutral-badge);
				padding-bottom: var(--space-5);

				.wallet-address {
					background-color: var(--clr-background-secondary);
					padding: var(--space-1) var(--space-3);
					border-radius: var(--radius-1);
					border: 1px solid var(--clr-border-primary);
					width: fit-content;
					font-size: var(--font-size-1);
				}
			}

			form {
				margin-top: var(--space-5);
			}

			.image-wrapper {
				position: relative;

				.hidden {
					display: none;
				}

				img {
					height: 140px;
					width: 140px;
					border-radius: 50%;
					border: 1px solid var(--clr-border-primary);
				}

				button {
					position: absolute;
					bottom: 8px;
					right: 8px;
					background-color: var(--clr-primary-main);
					border: none;
					border-radius: 50%;
					padding: var(--space-1);
					cursor: pointer;
					width: 26px;
					height: 26px;
					display: flex;
					justify-content: center;
					align-items: center;
					border: 2px solid var(--clr-surface-primary);
				}
			}

			.use-find-wrapper {
				width: 100%;
			}

			.username-label {
				color: var(--clr-text-off);
			}

			.find-name {
				color: var(--clr-heading-main);
			}

			.inputs-wrapper {
				width: 100%;
			}

			.success {
				color: var(--clr-primary-main);
			}
			.error {
				color: var(--clr-alert-main);
			}
		}
	}
</style>
