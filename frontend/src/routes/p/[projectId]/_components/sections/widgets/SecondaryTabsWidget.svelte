<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Tab, TabList, TabPanel, Tabs } from '@emerald-dao/component-library';
	import EventsList from '$lib/components/dao-data-blocks/events/list/EventsList.svelte';
	import MainFundersList from '$lib/components/dao-data-blocks/funders/list/MainFundersList.svelte';
	import RoundsList from '$lib/components/dao-data-blocks/funding-rounds/list/RoundsList.svelte';
	import SignersListElement from '$lib/features/multisig-manager/components/atoms/signers-list-element/SignersListElement.svelte';
	import PendingActionsList from '$components/dao-data-blocks/pending-actions/list/PendingActionsList.svelte';

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
				<PendingActionsList {daoData} showDetail={true} />
			</TabPanel>
		{/if}
	</Tabs>
</div>

<style type="scss">
	.tabs-wrapper {
		min-height: 400px;
		overflow-x: scroll;

		&::-webkit-scrollbar-track {
			border: none;
		}

		@include mq('small') {
			overflow-x: auto;
		}
	}
</style>
