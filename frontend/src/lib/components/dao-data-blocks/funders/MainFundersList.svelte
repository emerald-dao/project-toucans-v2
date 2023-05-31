<script type="ts">
	import { getFindProfilesBatch } from '$flow/utils';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import UserBalanceListElement from '../atoms/UserBalanceListElement.svelte';

	export let daoData: DAOProject;

	$: fundersEntries = Object.entries(daoData.onChainData.funders);
	$: mainFunderEntries = fundersEntries
		.sort((a, b) => (a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0))
		.slice(0, 10);

	async function fetchFindProfiles() {
		const addressList = mainFunderEntries.map((entry) => entry[0]);
		return await getFindProfilesBatch(addressList);
	}
</script>

<div class="column-2 align-start">
	{#if mainFunderEntries.length > 0}
		{#await fetchFindProfiles()}
			{#each fundersEntries as [address, balance]}
				<UserBalanceListElement
					{address}
					{balance}
					tokenSymbol={daoData.onChainData.paymentCurrency}
				/>
			{/each}
		{:then findProfiles}
			{#each fundersEntries as [address, balance]}
				<UserBalanceListElement
					findProfile={findProfiles[address]}
					{address}
					{balance}
					tokenSymbol={daoData.onChainData.paymentCurrency}
				/>
			{/each}
		{/await}
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
