<script lang="ts">
	import DashboardHeading from './DashboardHeading.svelte';
	import LockedVaultListElement from './LockedVaultListElement.svelte';
	import type { LockedVaultDetails } from '$lib/types/dao-project/lock-tokens/locked-vault-details.interface';

	export let lockedVaults: LockedVaultDetails[];
	export let projectOwner: string;
	export let projectId: string;

	function removeClaimedVault(i: number) {
		lockedVaults.splice(i, 1);
		lockedVaults = lockedVaults;
	}
</script>

<div class="column transactions-wrapper">
	<div class="header-wrapper">
		<DashboardHeading icon="tabler:lock-dollar">Locked Tokens</DashboardHeading>
	</div>
	{#if lockedVaults.length === 0}
		<p><em>This user has no locked transactions</em></p>
	{:else}
		<div>
			{#each lockedVaults as lockedVault, i (lockedVault.lockedVaultUuid)}
				<div class="activity-wrapper">
					<LockedVaultListElement
						{lockedVault}
						{i}
						{projectId}
						{projectOwner}
						{removeClaimedVault}
					/>
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
