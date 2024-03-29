<script lang="ts">
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import { profile, user } from '$stores/flow/FlowStore';
	import { Button } from '@emerald-dao/component-library';
	import { onMount } from 'svelte';
	import { writable, derived, type Writable } from 'svelte/store';
	import { fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Profile, ProfileTypes } from '$lib/types/common/profile.interface';
	import { fetchAllUserProfiles } from './fetchAllUserProfiles';

	export let form;

	// form state
	let isUploading = false;
	let errorMessage = '';

	// general data
	let allUserProfiles: {
		profiles: { [key in ProfileTypes]: Profile | null };
		useFind: boolean;
	};

	// Inputs elements
	let fileInput: HTMLInputElement;

	// Inputs data
	const inputImage: Writable<FileList> = writable();
	const inputUseFind = writable(false);
	const inputProfileName = writable('');

	onMount(async () => {
		if ($user.addr) {
			allUserProfiles = await fetchAllUserProfiles($user.addr);

			inputUseFind.set(allUserProfiles.useFind);
			inputProfileName.set(allUserProfiles.profiles.toucans?.name ?? '');
		}
	});

	const getImage = (node: HTMLImageElement) => {
		const imageToDisplay = derived([inputImage, inputUseFind], ([$inputImage, $inputUseFind]) => {
			if ($inputUseFind) {
				return (
					(allUserProfiles.profiles.find?.avatar as string) ??
					(allUserProfiles.profiles.random?.avatar as string)
				);
			}
			return $inputImage && $inputImage.length > 0
				? URL.createObjectURL($inputImage[0])
				: allUserProfiles.profiles.toucans?.avatar ?? ('/profile-placeholder.jpg' as string);
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
		([$inputImage, $inputUseFind, $inputProfileName]) => {
			if (allUserProfiles) {
				if ($inputUseFind !== allUserProfiles.useFind) {
					return true;
				} else if ($inputUseFind === true) {
					return false;
				} else {
					return (
						$inputImage.length > 0 || $inputProfileName !== allUserProfiles.profiles.toucans?.name
					);
				}
			} else {
				return false;
			}
		}
	);
</script>

{#if !$user.addr}
	<ConnectPage />
{:else if allUserProfiles}
	<section class="container-small column-6">
		<div class="card column-5">
			<div class="card-header">
				<h1>Edit profile</h1>
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
					<img use:getImage alt="User avatar" />
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
				{#if allUserProfiles.profiles.find}
					<span class="find-name w-medium large">{allUserProfiles.profiles.find.name}</span>
				{/if}
				{#if allUserProfiles.profiles.find}
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
					<Button
						color="neutral"
						size="small"
						width="full-width"
						state={isUploading ? 'loading' : $dataHasChanges ? 'active' : 'disabled'}
					>
						{#if isUploading}
							Updating
						{:else}
							Update profile
						{/if}
					</Button>
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

			.card-header {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: var(--space-3);

				h1 {
					font-size: var(--font-size-4);
					margin-bottom: var(--space-2);
				}

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
