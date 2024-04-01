<script lang="ts">
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import { user } from '$stores/flow/FlowStore';
	import { Button } from '@emerald-dao/component-library';
	import { writable, derived, type Writable } from 'svelte/store';
	import { fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Profile, ProfileTypes } from '$lib/types/common/profile.interface';
	import { fetchAllUserProfiles } from './fetchAllUserProfiles';

	export let form;

	// form state
	let isUploading = false;
	let errorMessage = '';

	interface UserProfiles {
		profiles: { [key in ProfileTypes]: Profile | null };
		useFind: boolean;
	}

	// general data
	let allUserProfiles: Promise<UserProfiles> | null = null;

	$: allUserProfiles = $user.addr
		? fetchAllUserProfiles($user.addr).then((p) => {
				inputUseFind.set(p.useFind);
				inputProfileName.set(p.profiles.toucans?.name ?? '');

				return p;
		  })
		: null;

	// Inputs elements
	let fileInput: HTMLInputElement;

	// Inputs data
	const inputImage: Writable<FileList> = writable();
	const inputUseFind = writable(false);
	const inputProfileName = writable('');

	const getImage = (node: HTMLImageElement, userProfiles: UserProfiles) => {
		const imageToDisplay = derived([inputImage, inputUseFind], ([$inputImage, $inputUseFind]) => {
			console.log('inputUserfind', $inputUseFind);

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

	const dataHasChanges = derived(
		[inputImage, inputUseFind, inputProfileName],
		async ([$inputImage, $inputUseFind, $inputProfileName]) => {
			const userProfiles = await allUserProfiles;

			if (userProfiles !== null) {
				console.log(userProfiles.profiles.toucans?.name);

				return (
					($inputImage && $inputImage.length > 0) ||
					$inputProfileName !== userProfiles.profiles.toucans?.name ||
					$inputUseFind !== userProfiles.useFind
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
		<div class="card column-5">
			<h1>Edit profile</h1>
			{#await allUserProfiles}
				<div class="loading-card">
					<Icon
						icon="svg-spinners:ring-resize"
						width="30px"
						height="30px"
						color="var(--clr-text-off)"
					/>
				</div>
			{:then allProfiles}
				{#if allProfiles === null}
					<span>Could not load profiles</span>
				{:else}
					<div class="card-header">
						<span class="wallet-address">
							<Icon icon="tabler:wallet" inline />
							{$user.addr}
						</span>
					</div>

					<form
						method="POST"
						class="column-4 align-center"
						use:enhance={() => {
							isUploading = true;

							return async ({ result, update }) => {
								if (result.type === 'success') {
									await update({ reset: false });
									// initialProfileName = inputProfileName;

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
							<span class="find-name w-medium large">{allProfiles.profiles.find.name}</span>
						{/if}
						{#if allProfiles.profiles.find}
							<label for="use-find" class="switch">
								<input type="checkbox" name="use-find" id="use-find" bind:checked={$inputUseFind} />
								<span class="slider" />
								Use .find profile
							</label>
						{/if}

						<input type="hidden" name="user" value={JSON.stringify($user)} />

						<div class="inputs-wrapper column-4">
							<div>
								{#if !$inputUseFind}
									<div
										class="column-1"
										transition:slide={{ delay: 250, duration: 300, easing: quintOut }}
									>
										<label for="user-name">Username</label>
										<input
											type="text"
											name="user-name"
											id="user-name"
											disabled={$inputUseFind}
											bind:value={$inputProfileName}
										/>
									</div>
								{/if}
							</div>
							{#await $dataHasChanges then hasChanges}
								<Button
									color="neutral"
									size="small"
									width="full-width"
									state={isUploading ? 'loading' : hasChanges ? 'active' : 'disabled'}
								>
									{#if isUploading}
										Updating
									{:else}
										Update profile
									{/if}
								</Button>
							{/await}
						</div>

						{#if errorMessage}
							<p class="error small">
								<Icon icon="tabler:alert-triangle" inline />
								{errorMessage}
							</p>
						{/if}

						{#if form?.success}
							<p class="success small">
								<Icon icon="tabler:check" inline />
								Profile succesfully updated
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

			h1 {
				font-size: var(--font-size-5);
				text-align: center;
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

				.wallet-address {
					background-color: var(--clr-background-secondary);
					padding: var(--space-1) var(--space-3);
					border-radius: var(--radius-1);
					border: 1px solid var(--clr-border-primary);
					width: fit-content;
					font-size: var(--font-size-1);
				}
			}

			.image-wrapper {
				position: relative;

				.hidden {
					display: none;
				}

				img {
					max-width: 140px;
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
				}
			}

			.find-name {
				color: var(--clr-text-off);
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
