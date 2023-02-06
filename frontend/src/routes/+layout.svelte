<script type="ts">
	import '../app.postcss';
	import '@emerald-dao/design-system/build/variables-dark.css';
	import '@emerald-dao/design-system/build/variables-light.css';
	import '@emerald-dao/design-system/build/variables.css';
	import '@emerald-dao/component-library/styles/app.scss';
	import { Header, Footer, TransactionModal } from '@emerald-dao/component-library';
	import { navElements, emeraldTools, socialMedia } from '$lib/config/navigation';
	import { theme } from '$stores/ThemeStore';
	import { logIn, unauthenticate } from '$flow/actions';
	import { user } from '$stores/flow/FlowStore';
	import { getFindProfile } from '$flow/utils';
	import { transactionStore } from '$stores/flow/TransactionStore';
	import { page } from '$app/stores';
	import * as fcl from '@onflow/fcl';

	$: if ($user) {
		console.log($user);
	}
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
/>
<main>
	<slot />
</main>
{#if $page.url.pathname === '/' || $page.url.pathname === '/discover'}
	<Footer {navElements} {emeraldTools} socials={socialMedia} />
{/if}
