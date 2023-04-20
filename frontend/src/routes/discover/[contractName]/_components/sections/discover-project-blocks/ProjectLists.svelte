<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Tab, TabList, TabPanel, Tabs } from '@emerald-dao/component-library';
	import { MainFundersList, EventsList, RoundsList } from '$components/dao-data-blocks';
	import SignersListElement from '$lib/features/multisig-manager/components/atoms/signers-list-element/SignersListElement.svelte';

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
		</TabList>
		<TabPanel>
			<EventsList {daoData} />
		</TabPanel>
		<TabPanel>
			{#each daoData.onChainData.signers as signer, i}
				<SignersListElement address={signer} {i} owner={i === 0} />
			{/each}
		</TabPanel>
		{#if fundingPerMonth}
			<TabPanel>
				<MainFundersList {daoData} />
			</TabPanel>
		{/if}
		{#if daoData.onChainData.fundingCycles.length > 0}
			<TabPanel>
				<RoundsList {daoData} />
			</TabPanel>
		{/if}
	</Tabs>
</div>

<style type="scss">
	.tabs-wrapper {
		min-height: 400px;
	}
</style>
