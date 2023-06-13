<script lang="ts">
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import UserSidebar from './_components/sections/sidebar/UserSidebar.svelte';
	import UserMain from './_components/sections/main/UserMain.svelte';
	import VaultDetail from './_components/sections/vaultDetail/VaultDetail.svelte';

	export let data;

	let selectedVault = writable(0);

	setContext('userData', data);
	setContext('selectedVault', selectedVault);
</script>

<div class="container">
	<UserSidebar />
	<UserMain />
</div>
{#if $selectedVault > 0}
	<VaultDetail />
{/if}

<style lang="scss">
	.container {
		display: grid;
		grid-template-columns: 5fr 6fr;
		flex: 1;
		gap: var(--space-16);
	}
</style>
