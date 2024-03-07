<script lang="ts">
	import Icon from '@iconify/svelte';
	import WalletLabel from '../WalletLabel.svelte';
	import type { Profile } from '$lib/types/common/profile.interface';
	import { user } from '$stores/flow/FlowStore';

	export let profile: Profile;
	export let fontSize = 'var(--font-size-1)';
	export let walletFontSize = '0.85em';
	export let showWallet = true;
	export let showCreateProfile = true;
</script>

<div class="main-wrapper" style={`font-size: ${fontSize}`}>
	{#if profile.name}
		<div class="username-wrapper align-center">
			<span class="username">{profile.name}</span>
			{#if profile.type === 'find'}
				<Icon icon="tabler:discount-check-filled" color="var(--clr-primary-main)" width="0.9em" />
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
			fontSize={walletFontSize}
		/>
	{/if}
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		overflow: hidden;

		.username-wrapper {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 0.3em;
			margin-bottom: 0.3em;
			overflow: hidden;

			.username {
				color: var(--clr-heading-main);
				font-size: 1em;
				line-height: 1.1;
				text-align: left;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
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
		}
	}
</style>
