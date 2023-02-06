<script type="ts">
	import { AdminNav } from './components';
	import { setContext } from 'svelte';
	import type { CommunityDao, FinancialDao } from '$lib/types/dao-project.interface';
	import { writable, type Writable } from 'svelte/store';
	import { user } from '$stores/flow/FlowStore';

	interface Data {
		[daoNumber: number]: FinancialDao | CommunityDao;
	}

	export let data: Data;

	const activeDao = writable(0);

	setContext<{
		activeDao: Writable<number>;
		userDaos: FinancialDao[] | CommunityDao[];
	}>('admin-data', {
		userDaos: Object.values(data),
		activeDao
	});
</script>

{#if !$user}
	<span>Connect Wallet</span>
{:else if Object.values(data).length < 1}
	<span>Create your first DAO</span>
{:else}
	<div class="section">
		<div class="container">
			<div class="main-wrapper">
				<AdminNav />
				<div class="content-wrapper">
					<slot />
				</div>
			</div>
		</div>
	</div>
{/if}

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);

		@include mq(medium) {
			display: grid;
			grid-template-columns: 1fr 4fr;
			gap: var(--space-16);
		}
	}
</style>
