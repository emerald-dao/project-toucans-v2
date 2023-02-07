<script type="ts">
	import DataCard from '$lib/components/cards/DataCard.svelte';
	import MainFunders from '../atoms/MainFunders.svelte';
	import RecentActivity from '../atoms/RecentActivity.svelte';
	import { Tabs, Tab, TabList, TabPanel } from '@emerald-dao/component-library';
	import RoundDetail from '$components/atoms/RoundDetail.svelte';
	import FundingStats from '$lib/components/atoms/FundingStats.svelte';
	import type { FinancialDao } from '$lib/types/dao-project.interface';
	import { getFundingCycleData } from '$lib/utilities/projects/getFundingCycleData';

	export let daoData: FinancialDao;

	const mostRecentCycle = getFundingCycleData(daoData, Number(daoData.mostRecentCycle));
</script>

{#if daoData}
	<div class="column-10">
		<div class="main-wrapper column-8">
			<div class="boxes-wrapper">
				<DataCard
					title="Total Funding"
					icon="tabler:pig-money"
					data={Number(daoData.totalFunding)}
					isCurrency
				/>
				<DataCard
					title="Circulating Supply"
					icon="tabler:coin"
					data={Number(daoData.totalSupply)}
					isCurrency
					currencyName={daoData.token_symbol}
				/>
			</div>
		</div>
		{#if daoData.fundingCycles.length > 0}
			<FundingStats fundingCycleData={mostRecentCycle} />
		{/if}
		<Tabs>
			<TabList>
				<Tab>Recent Activity</Tab>
				<Tab>Main Funders</Tab>
				<Tab>Rounds</Tab>
			</TabList>
			<TabPanel>
				<RecentActivity actions={daoData.actions} />
			</TabPanel>
			<TabPanel>
				<MainFunders {daoData} />
			</TabPanel>
			<TabPanel>
				<div class="rounds-wrapper">
					<span class="heading">Active</span>
					{#each daoData.fundingCycles as round}
						{#if round.cycleNum === daoData.currentFundingCycle}
							<RoundDetail {round} i={0} />
						{/if}
					{/each}
				</div>
				<div class="rounds-wrapper">
					<span class="heading">Finished</span>
					{#each daoData.fundingCycles as round, i}
						{#if round.cycleNum !== daoData.currentFundingCycle}
							<RoundDetail {round} discover={true} {i} />
						{/if}
					{/each}
				</div>
			</TabPanel>
		</Tabs>
	</div>
{/if}

<style type="scss">
	.boxes-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);

		@include mq(small) {
			flex-direction: row;
		}
	}

	.rounds-wrapper {
		display: flex;
		flex-direction: column;

		span {
			margin: 0;
			margin-top: var(--space-2);
		}
	}
</style>
