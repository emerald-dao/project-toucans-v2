<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Tab, TabList, TabPanel, Tabs } from '@emerald-dao/component-library';
	import { MainFundersList, EventsList, RoundsList } from '$components/dao-data-blocks';
	import SignersListElement from '$lib/features/multisig-manager/components/atoms/signers-list-element/SignersListElement.svelte';
	import PendingActionsList from '$components/dao-data-blocks/pending-actions/PendingActionsList.svelte';
	import VotesList from '$components/dao-data-blocks/votes/VotesList.svelte';

	export let daoData: DAOProject;

	let fundingPerMonth: {
		labels: string[];
		data: number[];
	} | null = null;
</script>

<div class="tabs-wrapper">
	<Tabs>
		<TabList>
			<Tab>Recent Activity</Tab>
			<Tab>Signers</Tab>
			{#if fundingPerMonth}
				<Tab>Main Funders</Tab>
			{/if}
			{#if daoData.onChainData.fundingCycles.length > 0}
				<Tab>Rounds</Tab>
			{/if}
			{#if daoData.onChainData.actions.length > 0}
				<Tab>Pending Actions</Tab>
			{/if}
			<Tab>Votes</Tab>
		</TabList>
		<TabPanel>
			<EventsList {daoData} />
		</TabPanel>
		<TabPanel>
			{#each daoData.onChainData.signers as signer, i}
				<SignersListElement address={signer} {i} owner={i === 0} deletable={false} />
			{/each}
		</TabPanel>
		{#if fundingPerMonth}
			<TabPanel>
				<MainFundersList {daoData} />
			</TabPanel>
		{/if}
		{#if daoData.onChainData.fundingCycles.length > 0}
			<TabPanel>
				<RoundsList {daoData} finishedFilter={false} />
			</TabPanel>
		{/if}
		{#if daoData.onChainData.actions.length > 0}
			<TabPanel>
				<PendingActionsList {daoData} showDetail={false} />
			</TabPanel>
		{/if}
		<TabPanel>
			<VotesList {daoData} />
		</TabPanel>
	</Tabs>
</div>

<style type="scss">
	.tabs-wrapper {
		min-height: 400px;
	}
</style>
