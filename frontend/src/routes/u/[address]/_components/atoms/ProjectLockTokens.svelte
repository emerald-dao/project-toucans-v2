<script lang="ts">
	import DashboardHeading from './DashboardHeading.svelte';
	import LockedTransactionListElement from './LockedTransactionListElement.svelte';
    import type { LockedVaultDetails } from '$lib/types/dao-project/lock-tokens/locked-vault-details.interface';
	export let lockedTransactions: LockedVaultDetails[];
    export let projectId:string;
</script>

<div class="column transactions-wrapper">
	<div class="header-wrapper">
		<DashboardHeading icon="tabler:lock">Locked Tokens</DashboardHeading>
	</div>
	{#if lockedTransactions.length === 0}
		<p><em>This user has no locked transactions</em></p>
	{:else}
		<div>
			{#each lockedTransactions as transaction, i}
					<div class="activity-wrapper">
						<LockedTransactionListElement {transaction} {i} {projectId} />
					</div>
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
