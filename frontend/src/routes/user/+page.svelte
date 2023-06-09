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

<section class="container">
	<div class="column-10">
		<UserProfile />
		<GeneralBalance />
	</div>
	<GeneralDetails />
</section>
{#if $selectedVault > 0}
	<UserVaults />
{/if}

<style lang="scss">
	section {
		display: grid;
		grid-template-columns: 2.2fr 3fr;
		flex: 1;
		gap: var(--space-18);
	}
</style>
