<script lang="ts">
	import { network } from '$flow/config';
	import '../app.postcss';
	import '@emerald-dao/design-system/build/variables-dark.css';
	import '@emerald-dao/design-system/build/variables-light.css';
	import '@emerald-dao/design-system/build/variables.css';
	import '@emerald-dao/component-library/styles/app.scss';
	import '../lib/styles/app.scss';
	import { Header, Footer, TransactionModal, Seo } from '@emerald-dao/component-library';
	import {
		navElements,
		emeraldTools,
		socialMedia,
		avatarDropdownNav
	} from '$lib/config/navigation';
	import { theme } from '$stores/ThemeStore';
	import { logIn, unauthenticate } from '$flow/actions';
	import { profile, user } from '$stores/flow/FlowStore';
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
	import dappInfo from '$lib/config/config';
	import getProfile from '$lib/utilities/api/getProfile';

	const connect = async () => {
		logIn().then(async () => {
			const userExists = await checkUser($user as CurrentUserObject);

			if (userExists) {
				console.log('User exists');
			} else {
				addUser($user as CurrentUserObject);
			}
		});
	};

	const connectProfileToStore = async (address: string) => {
		$profile = await getProfile(address);
	};

	$: if ($user.addr) {
		connectProfileToStore($user.addr);
	} else {
		$profile = null;
	}

	$: $user.addr && setNotifications($user.addr);
	$: !$user.addr && ($notifications = null);

	$: notificationsNumber = getNotificationsNumber($notifications);
	$: if (notificationsNumber > 0) avatarDropdownNav[2].notifications = notificationsNumber;

	$: if ($user.addr) {
		console.log('hi!');
		avatarDropdownNav[0].url = `/u/${$user.addr}`;
	}

	$: routes = $page.url.pathname.split('/');
</script>

<div class="body" class:full-height={routes[1] === 'admin'}>
	<Header
		themeStore={theme}
		logIn={() => connect()}
		{unauthenticate}
		user={$user}
		profile={$profile}
		{navElements}
		sticky={$page.url.pathname === '/' || $page.url.pathname === '/discover'}
		avatarDropDownNavigation={$user.addr ? avatarDropdownNav : undefined}
		{network}
		transactionInProgress={$transactionStore.progress}
		logoText="Toucans"
		logoUrl="/toucans-logo.png"
		{notificationsNumber}
		width={$page.url.pathname.includes('/admin') ? 'large' : 'medium'}
	/>
	<main>
		<slot />
	</main>
	{#if $page.url.pathname === '/' || $page.url.pathname === '/discover' || $page.url.pathname === '/docs'}
		<Footer
			{navElements}
			{emeraldTools}
			socials={socialMedia}
			logoText="Toucans"
			logoUrl="/toucans-logo.png"
		/>
	{/if}
</div>

<TransactionModal
	transactionInProgress={$transactionStore.progress}
	transactionStatus={$transactionStore.transaction}
	transactionId={$transactionStore.transactionId}
	{network}
	on:close={() => transactionStore.resetTransaction()}
/>

<Seo
	title={dappInfo.title}
	description={dappInfo.description}
	type="WebSite"
	image="https://toucans.ecdao.org/favicon.png"
/>

<style>
	.body {
		display: grid;
		flex-direction: column;
		overflow: hidden;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;
	}

	.full-height {
		height: 100vh;
	}

	main {
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
	}
</style>
