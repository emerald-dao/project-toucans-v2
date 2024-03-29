<script lang="ts">
	import { fetchAllProfilesFromUser } from './fetchAllProfilesFromUser';
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import { profile, user } from '$stores/flow/FlowStore';
	import { Button } from '@emerald-dao/component-library';
	import { onMount } from 'svelte';
	import { writable, derived, type Writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Profile } from '$lib/types/common/profile.interface';

	export let form;

	let isUploading = false;
	let errorMessage = '';

	let allUserProfiles: Writable<Profile[]> = writable([]);

	onMount(async () => {
		if (!$user.addr) return;

		const profilesData = await fetchAllProfilesFromUser($user.addr);

		$allUserProfiles = profilesData.profiles;

		initialUseFind = profilesData.useFind;
		$useFind = initialUseFind;

		initialProfileName =
			$allUserProfiles.find((p) => p.type === ($useFind ? 'find' : 'toucans'))?.name ?? '';
		inputProfileName = initialProfileName;
	});

	let initialProfileName = '';
	let inputProfileName: string;

	let initialUseFind: boolean;
	let useFind: Writable<boolean> = writable(false);

	$: dataHasChanges = inputProfileName !== initialProfileName || $useFind !== initialUseFind;
	$: findProfile = $allUserProfiles.find((p) => p.type === 'find');

	let image: Writable<FileList> = writable();
	let fileInput: HTMLInputElement;

	const getImage = (node: HTMLImageElement) => {
		const derivedImages = derived(
			[image, useFind, allUserProfiles],
			([$image, $useFind, $allUserProfiles]) => {
				return {
					uploadedImage: $image,
					useFin: $useFind,
					profileAvatar: ($useFind
						? $allUserProfiles.find((p) => p.type === 'find')?.avatar
						: $allUserProfiles.find((p) => p.type === 'toucans')?.avatar ??
						  '/profile-placeholder.jpg') as string
				};
			}
		);

		const unsubscribe = derivedImages.subscribe((value) => {
			if (value.uploadedImage && value.uploadedImage.length > 0 && value.useFin === false) {
				const reader = new FileReader();

				reader.onload = () => (node.src = reader.result as string);
				reader.readAsDataURL(value.uploadedImage[0]);
			} else {
				node.src = value.profileAvatar;
			}
		});

		return {
			destroy: () => unsubscribe()
		};
	};
</script>

{#if !$user.addr}
	<ConnectPage />
{:else}
	<section class="container-small column-6">
		{$profile?.avatar}
		<div class="card column-10">
			<div class="card-header">
				<h1>Edit profile</h1>
				<span class="wallet-address">
					<Icon icon="tabler:wallet" inline />
					{$user.addr}
				</span>
				{#if findProfile !== undefined}
					<span>{findProfile.name}</span>
				{/if}
			</div>

			<form
				method="POST"
				class="column-5 align-center"
				use:enhance={() => {
					isUploading = true;

					return async ({ result, update }) => {
						if (result.type === 'success') {
							await update({ reset: false });
							initialProfileName = inputProfileName;

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
				{#if $allUserProfiles.length > 0 && findProfile}
					<label for="use-find" class="switch">
						<input type="checkbox" name="use-find" id="use-find" bind:checked={$useFind} />
						<span class="slider" />
						Use .find profile
					</label>
				{/if}
				<div class="image-wrapper">
					<img use:getImage alt="User avatar" />
					{#if !$useFind}
						<button
							type="button"
							on:click={() => {
								fileInput.click();
							}}
						>
							<Icon icon="tabler:edit" inline width="14px" />
						</button>
						<input
							type="file"
							bind:this={fileInput}
							class="hidden"
							bind:files={$image}
							accept="image/png, image/jpeg"
							multiple={false}
							name="user-avatar"
						/>
					{/if}
				</div>

				<input type="hidden" name="user" value={JSON.stringify($user)} />

				<div>
					{#if !$useFind}
						<div
							class="column-1"
							transition:slide={{ delay: 250, duration: 300, easing: quintOut }}
						>
							<label for="user-name">Username</label>
							<input
								type="text"
								name="user-name"
								id="user-name"
								disabled={$useFind}
								bind:value={inputProfileName}
							/>
						</div>
					{/if}
				</div>
				<Button
					color="neutral"
					size="small"
					width="extended"
					state={isUploading ? 'loading' : dataHasChanges ? 'active' : 'disabled'}
				>
					{#if isUploading}
						Updating
					{:else}
						Update profile
					{/if}
				</Button>

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
					max-width: 120px;
					border-radius: var(--radius-2);
					border: 1px solid var(--clr-border-primary);
				}

				button {
					position: absolute;
					bottom: -4px;
					right: -6px;
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

			.success {
				color: var(--clr-primary-main);
			}
			.error {
				color: var(--clr-alert-main);
			}
		}
	}
</style>
