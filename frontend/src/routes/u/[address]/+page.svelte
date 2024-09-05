<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import UserSidebar from './_components/sections/sidebar/UserSidebar.svelte';
	import UserMain from './_components/sections/main/UserMain.svelte';
	import VaultDetail from './_components/sections/vaultDetail/VaultDetail.svelte';
	import OpenGraph from '$components/OpenGraph.svelte';

	export let data;

	let selectedVaultStore: Writable<null | number> = writable(null);

	setContext('selectedVault', selectedVaultStore);
</script>

<OpenGraph title={data.profile.name} />

<div class="container section">
	<UserSidebar userData={data} />
	<UserMain userData={data} />
</div>
{#if $selectedVaultStore !== null}
	<VaultDetail userData={data} {selectedVaultStore} />
{/if}

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		gap: var(--space-9);

		@include mq('medium') {
			display: grid;
			grid-template-columns: 5fr 6fr;
			flex: 1;
			gap: var(--space-16);
		}
	}
</style>
