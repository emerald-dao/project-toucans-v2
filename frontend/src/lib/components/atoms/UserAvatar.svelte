<script lang="ts">
	import Icon from '@iconify/svelte';
	import WalletLabel from './WalletLabel.svelte';
	import type { Profile } from '$lib/types/common/profile.interface';
	import { user } from '$stores/flow/FlowStore';

	export let size: string = '47px';
	export let address: string;
	export let twitter: string | undefined = undefined;
	export let showWallet = true;

	let getProfile: Promise<Profile> = fetch(`/api/get-profile/${address}`).then((data) =>
		data.json()
	);

	const handleImageError = (event: Event) => {
		if (event.target && event.target instanceof HTMLImageElement) {
			event.target.src = '/avatars/lost-toucan.png';
		}
	};
</script>

{#await getProfile}
	<div class="row-3 align-center header-link change-opacity">
		<img src="/avatar-2.png" alt="avatar" style={`width: ${size}; height: ${size}`} />
		<div class="column">
			<div class="row-2">
				<span class="username">Searching Toucan...</span>
				{#if twitter}
					<a href={`twitter.com/${twitter}`} class="center">
						<Icon icon="tabler:brand-twitter" class="header-link center" />
					</a>
				{/if}
			</div>
			{#if showWallet}
				<WalletLabel address="0xf8d6e0586b0a20c7" withBorder={false} color="var(--clr-text-off)" />
			{/if}
		</div>
	</div>
{:then profile}
	<a class="row-3 align-center header-link" href={`/u/${profile.address}`}>
		<div class="image-wrapper">
			<img
				src={profile.avatar}
				alt="avatar"
				style={`width: ${size}; height: ${size}`}
				on:error={handleImageError}
			/>
			{#if profile.address === $user.addr}
				<div class="icon-wrapper">
					<Icon icon="tabler:accessible-off-filled" color="var(--clr-primary-main)" width="16px" />
				</div>
			{/if}
		</div>

		<div class="column">
			{#if profile.name}
				<div class="row-1 align-center">
					<span class="username">{profile.name}</span>
					{#if profile.type === 'find'}
						<div class="row align-end verified-wrapper">
							<Icon icon="tabler:discount-check-filled" color="var(--clr-primary-main)" />
						</div>
					{/if}
					{#if twitter}
						<a href={`twitter.com/${twitter}`} class="center">
							<Icon icon="tabler:brand-twitter" class="header-link center" />
						</a>
					{/if}
					{#if profile.type === 'random' && profile.address === $user.addr}
						<a class="create-profile" href="https://find.xyz/" target="_blank" rel="noreferrer"
							>Create profile</a
						>
					{/if}
				</div>
			{/if}
			{#if showWallet}
				<WalletLabel address={profile.address} withBorder={false} color="var(--clr-text-off)" />
			{/if}
		</div>
	</a>
{/await}

<style lang="scss">
	.image-wrapper {
		position: relative;

		img {
			border-radius: 50%;
		}

		.icon-wrapper {
			position: absolute;
			bottom: -2px;
			right: -2px;
			width: 18px;
			height: 18px;
			border-radius: 50%;
			background-color: var(--clr-background-primary);
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.username {
		color: var(--clr-heading-main);
		font-size: var(--font-size-1);
		margin-bottom: -3px;
	}

	.verified-wrapper {
		margin-top: 2.7px;
	}

	span {
		font-size: var(--font-size-0);
	}

	.create-profile {
		background-color: var(--clr-primary-main);
		color: var(--clr-heading-inverse);
		font-size: 11px;
		padding: 1px 7px;
		line-height: 1.2;
		border-radius: var(--radius-0);
		text-decoration: none;
		margin-left: var(--space-1);
		margin-top: 2px;
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
