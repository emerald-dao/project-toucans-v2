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
	import { checkUser } from '$lib/features/users/functions/checkUser';
	import { addUser } from '$lib/features/users/functions/postUser';
	import type { CurrentUserObject } from '@onflow/fcl';
	import {
		getNotificationsNumber,
		notifications,
		setNotifications
	} from '$lib/features/notifications/stores/NotificationsStore';

	const connect = async () => {
		logIn().then(async () => {
			const userExists = await checkUser($user as CurrentUserObject);

			if (userExists) {
				console.log('User exists');
			} else {
				addUser($user as CurrentUserObject);
				console.log('User added');
			}
		});
	};

	$: $user.addr && setNotifications($user.addr);
	$: !$user.addr && ($notifications = null);

	$: notificationsNumber = getNotificationsNumber($notifications);
	$: if (notificationsNumber > 0) avatarDropdownNav[1].notifications = notificationsNumber;
</script>

<TransactionModal
	transactionInProgress={$transactionStore.progress}
	transactionStatus={$transactionStore.transaction}
	on:close={() => transactionStore.resetTransaction()}
/>
<Header
	themeStore={theme}
	logIn={() => connect()}
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
	{notificationsNumber}
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
		overflow-x: hidden;
	}
</style>
