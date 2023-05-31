<script type="ts">
	import { getFindProfilesBatch } from '$flow/utils';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import UserBalanceListElement from '../atoms/UserBalanceListElement.svelte';

	export let daoData: DAOProject;

	$: holdersEntries = Object.entries(daoData.onChainData.balances);
	$: mainHoldersEntries = holdersEntries
		.filter((entry) => entry[0] !== daoData.generalInfo.owner)
		.sort((a, b) => (a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0))
		.slice(0, 10);

	async function fetchFindProfiles() {
		const addressList = mainHoldersEntries.map((entry) => entry[0]);
		return await getFindProfilesBatch(addressList);
	}
</script>

<div class="column-2 align-start">
	{#if mainHoldersEntries.length > 0}
		{#await fetchFindProfiles()}
			{#each holdersEntries as [address, balance]}
				<UserBalanceListElement
					{address}
					{balance}
					tokenSymbol={daoData.generalInfo.token_symbol}
				/>
			{/each}
		{:then findProfiles}
			{#each holdersEntries as [address, balance]}
				<UserBalanceListElement
					findProfile={findProfiles[address]}
					{address}
					{balance}
					tokenSymbol={daoData.generalInfo.token_symbol}
				/>
			{/each}
		{/await}
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
