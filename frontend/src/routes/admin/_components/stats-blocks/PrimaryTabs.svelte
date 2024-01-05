<script lang="ts">
	import RoundsList from '$lib/components/dao-data-blocks/funding-rounds/list/RoundsList.svelte';
	import EventsList from '$lib/components/dao-data-blocks/events/list/EventsList.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Tab, TabList, TabPanel, Tabs } from '@emerald-dao/component-library';
	import RoundsCard from '$components/dao-data-blocks/funding-rounds/widget/RoundsWidget.svelte';
	import { getProjectNFTTreasury } from '$flow/actions';
	import NftsTreasuryWidget from '../../../p/[projectId]/_components/sections/widgets/NftsTreasuryWidget.svelte';
	import { onMount } from 'svelte';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';

	export let daoData: DAOProject;

	let NFTs: {
		[collectionIdentifier: string]: Nft[];
	};

	onMount(async () => {
		NFTs = await getProjectNFTTreasury(daoData.generalInfo.owner, daoData.generalInfo.project_id);
	});
</script>

<div class="main-wrapper">
	<Tabs>
		<TabList>
			<Tab>Recent Events</Tab>
			{#if daoData.onChainData.currentFundingCycle}
				<Tab>Active Round</Tab>
			{/if}
			{#if daoData.onChainData.fundingCycles.length > 0}
				<Tab>Rounds</Tab>
			{/if}
			{#if Object.keys(NFTs).length > 0}
				<Tab>NFTs</Tab>
			{/if}
		</TabList>
		<TabPanel>
			<EventsList {daoData} />
		</TabPanel>
		{#if daoData.onChainData.currentFundingCycle}
			<TabPanel>
				<div class="card-wrapper card">
					<RoundsCard
						round={daoData.onChainData.currentFundingCycle}
						projectToken={daoData.generalInfo.token_symbol}
						paymentToken={daoData.onChainData.paymentCurrency}
						projectId={daoData.generalInfo.project_id}
						hasBorder={false}
						activeRound={Number(daoData.onChainData.currentFundingCycle.details.cycleId)}
					/>
				</div>
			</TabPanel>
		{/if}
		{#if daoData.onChainData.fundingCycles.length > 0}
			<TabPanel>
				<RoundsList {daoData} finishedFilter={false} />
			</TabPanel>
		{/if}
		{#if Object.keys(NFTs).length > 0}
			<TabPanel>
				<div class="card-wrapper">
					<NftsTreasuryWidget {NFTs} hasTitle={false} pageSize={3} />
				</div>
			</TabPanel>
		{/if}
	</Tabs>
</div>

<style lang="scss">
	.main-wrapper {
		.card-wrapper {
			margin-top: var(--space-4);
		}
	}
</style>
