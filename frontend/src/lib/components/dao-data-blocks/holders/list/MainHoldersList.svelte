<script type="ts">
	import UserBalanceListElement from '$lib/components/dao-data-blocks/users-balance/list/UserBalanceListElement.svelte';
	import { getFindProfilesBatch } from '$flow/utils';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import DownloadHolders from '../../../../../routes/admin/[projectId]/_components/stats-blocks/atoms/DownloadHolders.svelte';

	export let daoData: DAOProject;

	const lpAddresses = Object.values(daoData.onChainData.lpAddresses);
	$: holdersEntries = Object.entries(daoData.onChainData.balances);
	$: mainHoldersEntries = holdersEntries
		.filter((entry) => entry[0] !== daoData.generalInfo.owner && !lpAddresses.includes(entry[0]))
		.sort((a, b) => (Number(a[1]) < Number(b[1]) ? 1 : Number(a[1]) > Number(b[1]) ? -1 : 0))
		.slice(0, 10);

	async function fetchFindProfiles() {
		const addressList = mainHoldersEntries.map((entry) => entry[0]);
		return await getFindProfilesBatch(addressList);
	}
</script>

<div class="main-wrapper column-2 align-start">
	{#if mainHoldersEntries.length > 0 && daoData.generalInfo.token_symbol}
		{#await fetchFindProfiles()}
			{#each mainHoldersEntries as [address, balance]}
				<UserBalanceListElement
					{address}
					balance={Number(balance)}
					tokenSymbol={daoData.generalInfo.token_symbol}
				/>
			{/each}
		{:then findProfiles}
			{#each mainHoldersEntries as [address, balance]}
				<UserBalanceListElement
					findProfile={findProfiles[address]}
					{address}
					balance={Number(balance)}
					tokenSymbol={daoData.generalInfo.token_symbol}
				/>
			{/each}
			<DownloadHolders
				holders={daoData.onChainData.balances}
				{lpAddresses}
				{findProfiles}
				{daoData}
			/>
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
