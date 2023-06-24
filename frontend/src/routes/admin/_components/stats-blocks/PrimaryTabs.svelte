<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Tab, TabList, TabPanel, Tabs } from '@emerald-dao/component-library';
	import { EventsList, RoundsList } from '$components/dao-data-blocks';
	import RoundsCard from '$components/dao-data-blocks/funding-rounds/RoundsCard.svelte';

	export let daoData: DAOProject;
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
		</TabList>
		<TabPanel>
			<EventsList {daoData} />
		</TabPanel>
		{#if daoData.onChainData.currentFundingCycle}
			<TabPanel>
				<div class="round-card-wrapper card">
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
	</Tabs>
</div>

<style lang="scss">
	.main-wrapper {
		.round-card-wrapper {
			margin-top: var(--space-4);
		}
	}
</style>
