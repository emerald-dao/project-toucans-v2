<script type="ts">
	import UserBalanceListElement from '$lib/components/dao-data-blocks/users-balance/list/UserBalanceListElement.svelte';
	import { getFindProfilesBatch } from '$flow/utils';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import DownloadFunders from '../../../../../routes/admin/[projectId]/_components/stats-blocks/atoms/DownloadFunders.svelte';

	export let daoData: DAOProject;

	$: fundersEntries = Object.entries(daoData.funding.funders);
	$: mainFunderEntries = fundersEntries
		.sort((a, b) =>
			Number(a[1].amount) < Number(b[1].amount)
				? 1
				: Number(a[1].amount) > Number(b[1].amount)
				? -1
				: 0
		)
		.slice(0, 10);

	async function fetchFindProfiles() {
		const addressList = mainFunderEntries.map((entry) => entry[0]);

		return await getFindProfilesBatch(addressList);
	}
</script>

<div class="column-2 align-start">
	{#if mainFunderEntries.length > 0}
		{#await fetchFindProfiles()}
			{#each mainFunderEntries as [address, { amount }]}
				<UserBalanceListElement {address} balance={amount} />
			{/each}
		{:then findProfiles}
			{#each mainFunderEntries as [address, { amount }]}
				<UserBalanceListElement findProfile={findProfiles[address]} {address} balance={amount} />
			{/each}
			<DownloadFunders
				projectId={daoData.generalInfo.project_id}
				funders={daoData.funding.funders}
				{findProfiles}
			/>
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
