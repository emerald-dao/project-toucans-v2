<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { user } from '$stores/flow/FlowStore';
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import {
		addNotification,
		removeNotification
	} from '$lib/features/notifications/functions/postNotification';
	import { checkSubscription } from '$lib/features/notifications/functions/checkSubscription';
	import { onMount } from 'svelte';

	export let projectId: string;
	export let projectOwner: string;

	let userSubscribed = false;
	let buttonHover = false;

	const checkUserSubscription = async () => {
		if ($user.loggedIn) {
			userSubscribed = await checkSubscription(projectId, $user);
		} else {
			userSubscribed = false;
		}
	};

	const onSubscribe = async () => {
		addNotification(projectId, projectOwner).then(() => {
			checkUserSubscription();
		});
	};

	const onUnsubscribe = () => {
		removeNotification(projectId, projectOwner).then(() => {
			checkUserSubscription();
		});
	};

	onMount(async () => {
		await checkUserSubscription();
	});

	$: $user && checkUserSubscription();
</script>

{#if userSubscribed}
	<button
		class="unfollow"
		on:click={onUnsubscribe}
		on:mouseenter={() => (buttonHover = true)}
		on:mouseleave={() => (buttonHover = false)}
	>
		{#if buttonHover}
			<Icon icon="tabler:bell-minus" />
		{:else}
			<Icon icon="tabler:bell-check" />
		{/if}
	</button>
{:else}
	<button
		class="follow"
		on:click={onSubscribe}
		on:mouseenter={() => (buttonHover = true)}
		on:mouseleave={() => (buttonHover = false)}
	>
		{#if buttonHover}
			<Icon icon="tabler:bell-plus" />
		{:else}
			<Icon icon="tabler:bell-off" />
		{/if}
	</button>
{/if}

<style type="scss">
	button {
		border: none;
		background: none;
		cursor: pointer;
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.7rem;
		height: 1.7rem;
		border-radius: 50%;
		transition: all 0.2s ease-in-out;
	}

	.follow {
		color: var(--clr-font-text);
	}

	.unfollow {
		color: var(--clr-primary-main);
	}

	.unfollow:hover {
		color: var(--clr-alert-main);
	}
</style>
