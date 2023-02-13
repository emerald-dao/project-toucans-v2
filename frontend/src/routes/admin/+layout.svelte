<script type="ts">
	import { AdminNav } from './__components';
	import { setContext } from 'svelte';
	import type { CommunityDao, FinancialDao } from '$lib/types/dao-project.interface';
	import { writable, type Writable } from 'svelte/store';
	import { user } from '$stores/flow/FlowStore';

	interface Data {
		projects: (FinancialDao | CommunityDao)[]
	}

	export let data: Data;

	const activeDao = writable(0);

	setContext<{
		activeDao: Writable<number>;
		userDaos: (FinancialDao | CommunityDao)[];
	}>('admin-data', {
		userDaos: data.projects,
		activeDao
	});
</script>

<section class="container">
	{#if !$user}
		<span>Connect Wallet</span>
	{:else if data.projects.length < 1}
		<span>Create your first DAO</span>
	{:else}
		<AdminNav />
		<slot />
	{/if}
</section>

				
<style type="scss">
	section {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
		
		@include mq(medium) {
			display: grid;
			grid-template-columns: 220px auto;
			gap: var(--space-16);
		}
	}
</style>
