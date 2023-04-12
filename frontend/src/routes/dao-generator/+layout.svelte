<script type="ts">
	import { user } from '$stores/flow/FlowStore';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import DesktopOnlyPage from '$components/desktop-only-page/DesktopOnlyPage.svelte';

	let screenSize: number;
</script>

<svelte:window bind:innerWidth={screenSize} />

{#if screenSize < 1040}
	<DesktopOnlyPage />
{:else if !$user.addr}
	<ConnectPage />
{:else}
	<slot />
{/if}
