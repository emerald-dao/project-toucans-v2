<script lang="ts">
	import Icon from '@iconify/svelte';
	import WalletLabel from '../WalletLabel.svelte';
	import type { Profile } from '$lib/types/common/profile.interface';
	import { user } from '$stores/flow/FlowStore';
	import UserName from './UserName.svelte';
	import { onMount } from 'svelte';

	export let imageSize = '47px';
	export let fontSize = 'var(--font-size-1)';
	export let walletFontSize = '0.85em';
	export let address: string | undefined = undefined;
	export let showWallet = true;
	export let showName = true;
	export let showCreateProfile = false;
	export let userLink = true;

	export let userProfile: Profile | undefined = undefined;

	const handleImageError = (event: Event) => {
		if (event.target && event.target instanceof HTMLImageElement) {
			event.target.src = '/avatars/lost-toucan.png';
		}
	};

	onMount(() => {
		if (userProfile === undefined) {
			const getProfile = async () => {
				userProfile = await fetch(`/api/get-profile/${address}`).then(
					async (data) => (await data.json()) as Profile
				);
			};
			getProfile();
		}
	});
</script>

{#if !userProfile}
	<div class="row-3 align-center header-link change-opacity" style={`font-size: ${fontSize}`}>
		<img src="/avatar-2.png" alt="avatar" style={`width: ${imageSize}; height: ${imageSize}`} />
		{#if showName}
			<div class="column">
				<div class="row-2">
					<span class="username">Searching Toucan...</span>
				</div>
				{#if showWallet}
					<WalletLabel
						address="0xf8d6e0586b0a20c7"
						withBorder={false}
						color="var(--clr-text-off)"
						fontSize={walletFontSize}
					/>
				{/if}
			</div>
		{/if}
	</div>
{:else}
	<a
		class="row align-center header-link"
		href={`/u/${userProfile.address}`}
		style={`font-size: ${fontSize}`}
		class:disabled={!userLink}
		data-sveltekit-preload-data="hover"
	>
		<div class="image-wrapper">
			<img
				src={userProfile.avatar}
				alt="avatar"
				style={`width: ${imageSize}; height: ${imageSize}`}
				on:error={handleImageError}
			/>
			{#if userProfile.address === $user.addr}
				<div class="icon-wrapper" style={`font-size: ${imageSize}`}>
					<Icon
						icon="tabler:accessible-off-filled"
						color="var(--clr-primary-main)"
						width="0.25em"
					/>
				</div>
			{/if}
		</div>
		{#if showName}
			<UserName
				profile={userProfile}
				{fontSize}
				{showWallet}
				{walletFontSize}
				{showCreateProfile}
			/>
		{/if}
	</a>
{/if}

<style lang="scss">
	a {
		overflow: hidden;
		gap: 0.45em;
	}

	a.disabled {
		pointer-events: none;
	}

	img {
		border-radius: 50%;
	}

	.image-wrapper {
		position: relative;
		background-color: var(--clr-surface-primary);
		border-radius: 50%;

		.icon-wrapper {
			position: absolute;
			bottom: 0;
			right: 0;
			width: 0.26em;
			height: 0.26em;
			border-radius: 50%;
			background-color: var(--clr-background-primary);
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.username {
		color: var(--clr-heading-main);
		font-size: 1em;
		margin-bottom: -3px;
	}

	.change-opacity {
		animation-name: change-opacity;
		animation-duration: 1.7s;
		animation-iteration-count: infinite;
	}

	// change opacity effect
	@keyframes change-opacity {
		0% {
			opacity: 0.08;
		}
		50% {
			opacity: 0.14;
		}
		100% {
			opacity: 0.08;
		}
	}
</style>
