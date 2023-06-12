<script lang="ts">
	import UserProfile from './_components/atoms/UserProfile.svelte';
	import UserVaults from './_components/atoms/UserVaults.svelte';
	import GeneralBalance from './_components/atoms/GeneralBalance.svelte';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import GeneralDetails from './_components/atoms/GeneralDetails.svelte';

	let selectedVault = writable(0);

	setContext('selectedVault', selectedVault);
</script>

<div class="container">
	<div class="column-5 section">
		<UserProfile />
		<GeneralBalance />
	</div>
	<div class="section">
		<GeneralDetails />
	</div>
</div>
{#if $selectedVault > 0}
	<UserVaults />
{/if}

<style lang="scss">
	.container {
		display: grid;
		grid-template-columns: 4fr 6fr;
		flex: 1;
		gap: var(--space-16);
	}
</style>
