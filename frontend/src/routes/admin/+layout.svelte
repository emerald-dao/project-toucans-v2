<script lang="ts">
	import OpenGraph from '$components/OpenGraph.svelte';
	import { Button } from '@emerald-dao/component-library';
	import { user } from '$stores/flow/FlowStore';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import { invalidate } from '$app/navigation';
	import DesktopOnlyPage from '$components/desktop-only-page/DesktopOnlyPage.svelte';

	export let data;

	let screenSize: number;

	const onChangeUser = async () => {
		await invalidate('app:admin');
	};

	$: $user.addr && onChangeUser();
</script>

<OpenGraph title="Admin" />

<svelte:window bind:innerWidth={screenSize} />

{#if screenSize < 1040}
	<DesktopOnlyPage />
{:else if !$user.addr}
	<ConnectPage />
{:else}
	<slot />
{/if}
