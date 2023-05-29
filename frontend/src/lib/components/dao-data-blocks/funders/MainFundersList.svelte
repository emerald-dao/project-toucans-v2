<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import UserBalanceListElement from '../atoms/UserBalanceListElement.svelte';

	export let daoData: DAOProject;

	$: fundersEntries = Object.entries(daoData.onChainData.funders);
</script>

<div class="column-2 align-start">
	{#if fundersEntries.length > 0}
		{#each fundersEntries as [address, balance]}
			<UserBalanceListElement
				{address}
				{balance}
				tokenSymbol={daoData.onChainData.paymentCurrency}
			/>
		{/each}
	{:else}
		<div class="no-funders-wrapper">
			<span class="small"><em>No funders yet</em></span>
		</div>
	{/if}
</div>

<style lang="scss">
	.no-funders-wrapper {
		display: flex;
		justify-content: center;
		margin-top: var(--space-4);

		em {
			color: var(--clr-text-off);
		}
	}
</style>
