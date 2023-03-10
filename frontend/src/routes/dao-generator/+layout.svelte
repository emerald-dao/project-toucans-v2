<script type="ts">
	import { user } from '$stores/flow/FlowStore';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
</script>

{#if !$user.addr}
	<ConnectPage />
{:else}
	<slot />
{/if}
