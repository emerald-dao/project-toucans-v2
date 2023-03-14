<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import UserBalanceListElement from '../atoms/UserBalanceListElement.svelte';

	export let daoData: DAOProject;

	$: holdersEntries = Object.entries(daoData.onChainData.balances);
</script>

<div class="column-2 align-start">
	{#if holdersEntries.length > 0}
		{#each holdersEntries as [address, balance]}
			<UserBalanceListElement {address} {balance} tokenSymbol={daoData.generalInfo.token_symbol} />
		{/each}
	{:else}
		<div class="no-holders-wrapper">
			<span class="small"><em>No holders yet</em></span>
		</div>
	{/if}
</div>

<style lang="scss">
	.no-holders-wrapper {
		display: flex;
		justify-content: center;
		margin-top: var(--space-4);

		em {
			color: var(--clr-text-off);
		}
	}
</style>
