<script type="ts">
	import { user } from '$stores/flow/FlowStore';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import DesktopOnlyPage from '$components/desktop-only-page/DesktopOnlyPage.svelte';
	import OpenGraph from '$components/OpenGraph.svelte';

	let screenSize: number;
</script>

<svelte:window bind:innerWidth={screenSize} />

<OpenGraph title="DAO Generator" />

{#if screenSize < 1040}
	<DesktopOnlyPage />
{:else if !$user.addr}
	<ConnectPage />
{:else}
	<slot />
{/if}
