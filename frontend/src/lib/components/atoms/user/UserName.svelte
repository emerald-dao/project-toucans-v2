<script lang="ts">
	import Icon from '@iconify/svelte';
	import WalletLabel from '../WalletLabel.svelte';
	import type { Profile } from '$lib/types/common/profile.interface';
	import { user } from '$stores/flow/FlowStore';

	export let profile: Profile;
	export let fontSize = 'var(--font-size-1)';
	export let showWallet = true;
	export let showCreateProfile = true;
</script>

<div class="column" style={`font-size: ${fontSize}`}>
	{#if profile.name}
		<div class="row-1 align-center">
			<span class="username">{profile.name}</span>
			{#if profile.type === 'find'}
				<div class="row align-end verified-wrapper">
					<Icon icon="tabler:discount-check-filled" color="var(--clr-primary-main)" />
				</div>
			{/if}
			{#if profile.type === 'random' && profile.address === $user.addr && showCreateProfile}
				<a class="create-profile" href="https://find.xyz/" target="_blank" rel="noreferrer"
					>Create profile</a
				>
			{/if}
		</div>
	{/if}
	{#if showWallet}
		<WalletLabel
			address={profile.address}
			withBorder={false}
			color="var(--clr-text-off)"
			fontSize="0.85em"
		/>
	{/if}
</div>

<style lang="scss">
	.username {
		color: var(--clr-heading-main);
		font-size: 1em;
		margin-bottom: -3px;
		line-height: 1.2;
	}

	.verified-wrapper {
		margin-top: 2.7px;
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
</style>
