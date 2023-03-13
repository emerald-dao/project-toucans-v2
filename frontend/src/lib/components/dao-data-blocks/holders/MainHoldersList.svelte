<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import UserBalanceListElement from '../atoms/UserBalanceListElement.svelte';

	export let daoData: DAOProject;
</script>

<div class="column-2 align-start">
	{#each Object.entries(daoData.onChainData.balances) as [address, balance]}
		<UserBalanceListElement {address} {balance} tokenSymbol={daoData.generalInfo.token_symbol} />
	{/each}
</div>
