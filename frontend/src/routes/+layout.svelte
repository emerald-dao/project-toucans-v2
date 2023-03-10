<script type="ts">
	import { network } from '$flow/config.ts';
	import '../app.postcss';
	import '@emerald-dao/design-system/build/variables-dark.css';
	import '@emerald-dao/design-system/build/variables-light.css';
	import '@emerald-dao/design-system/build/variables.css';
	import '@emerald-dao/component-library/styles/app.scss';
	import { Header, Footer, TransactionModal } from '@emerald-dao/component-library';
	import {
		navElements,
		emeraldTools,
		socialMedia,
		avatarDropdownNav
	} from '$lib/config/navigation';
	import { theme } from '$stores/ThemeStore';
	import { logIn, unauthenticate } from '$flow/actions';
	import { user } from '$stores/flow/FlowStore';
	import { getFindProfile } from '$flow/utils';
	import { transactionStore } from '$stores/flow/TransactionStore';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';

	$: if ($user) {
		console.log($user);
	}

	// If the connected address changes, invalidate all fetched data to get data for the new address
	$: $user.addr && invalidateAll();
</script>

<TransactionModal
	transactionInProgress={$transactionStore.progress}
	transactionStatus={$transactionStore.transaction}
/>
<Header
	themeStore={theme}
	{logIn}
	{unauthenticate}
	{getFindProfile}
	user={$user}
	{navElements}
	sticky={$page.url.pathname === '/' || $page.url.pathname === '/discover'}
	avatarDropDownNavigation={avatarDropdownNav}
	{network}
	transactionInProgress={$transactionStore.progress}
	logoText="Toucans"
	logoUrl="/ec-logo.png"
/>
<main>
	<slot />
</main>
{#if $page.url.pathname === '/' || $page.url.pathname === '/discover'}
	<Footer
		{navElements}
		{emeraldTools}
		socials={socialMedia}
		logoText="Toucans"
		logoUrl="/ec-logo.png"
	/>
{/if}

<style>
	main {
		display: flex;
		flex-direction: column;
	}
</style>
