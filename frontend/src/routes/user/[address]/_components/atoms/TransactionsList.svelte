<script lang="ts">
	import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';
	import DashboardHeading from './DashboardHeading.svelte';
	import TransactionListElement from './TransactionListElement.svelte';

	export let events: DaoEvent[];
</script>

<div class="column transactions-wrapper">
	<div class="header-wrapper">
		<DashboardHeading icon="tabler:activity">Recent transactions</DashboardHeading>
	</div>
	{#if events.length === 0}
		<p><em>This user has no transactions yet</em></p>
	{:else}
		<div>
			{#each events as event, i}
				{#if i < 4}
					<div class="activity-wrapper">
						<TransactionListElement {event} {i} />
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.transactions-wrapper {
		width: 100%;

		.header-wrapper {
			border-bottom: 1px solid var(--clr-border-primary);
			padding: var(--space-2);
		}

		.activity-wrapper {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			padding: var(--space-3);
			border-bottom: 1px solid var(--clr-neutral-badge);
		}
	}

	em {
		font-size: var(--font-size-0);
		color: var(--clr-text-off);
	}
</style>
