<script lang="ts">
	import Icon from '@iconify/svelte';
	import WalletLabel from './WalletLabel.svelte';
	import type { Profile } from '$lib/types/common/profile.interface';

	export let size: string = '47px';
	export let profile: Profile;
	export let twitter: string | undefined = undefined;
	export let showWallet = true;
</script>

<a class="row-3 align-center header-link" href={`u/${profile.address}`}>
	<img src={profile.avatar} alt="avatar" style={`width: ${size}; height: ${size}`} />
	<div class="column">
		{#if profile.name}
			<div class="row-2">
				<span class="username">{profile.name}</span>
				{#if twitter}
					<a href={`twitter.com/${twitter}`} class="center">
						<Icon icon="tabler:brand-twitter" class="header-link center" />
					</a>
				{/if}
			</div>
		{/if}
		{#if showWallet}
			<WalletLabel address={profile.address} withBorder={false} color="var(--clr-text-off)" />
		{/if}
	</div>
</a>

<style lang="scss">
	img {
		border-radius: 50%;
	}

	.username {
		color: var(--clr-heading-main);
		font-size: var(--font-size-1);
		margin-bottom: -3px;
	}

	span {
		font-size: var(--font-size-0);
	}
</style>
