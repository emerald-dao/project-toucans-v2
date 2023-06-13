<script lang="ts">
	import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';
	import DashboardHeading from './DashboardHeading.svelte';
	import TransactionListElement from './TransactionListElement.svelte';

	export let events: DaoEvent[];
</script>

<div class="column-2 transactions-wrapper">
	<DashboardHeading icon="tabler:activity">Recent transactions</DashboardHeading>
	{#if events.length === 0}
		<p><em>This user has no transactions yet</em></p>
	{:else}
		{#each events as event, i}
			<TransactionListElement {event} {i} />
		{/each}
	{/if}
</div>

<style lang="scss">
	.transactions-wrapper {
		width: 100%;
		padding-inline: var(--space-8);
	}

	em {
		font-size: var(--font-size-0);
	}
</style>
