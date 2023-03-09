<script type="ts">
	import DataCard from '$components/atoms/cards/DataCard.svelte';
	import MainFunders from '../atoms/MainFunders.svelte';
	import RecentActivity from '../atoms/RecentActivity.svelte';
	import { Tabs, Tab, TabList, TabPanel } from '@emerald-dao/component-library';
	import RoundDetail from '$components/atoms/RoundDetail.svelte';
	import FundingStats from '$lib/components/atoms/FundingStats.svelte';
	import { getFundingCycleData } from '$lib/utilities/projects/getFundingCycleData';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import PieChart from '$components/charts/PieChart.svelte';
	import { user } from '$stores/flow/FlowStore';
	import SignatureElement from '$lib/features/add-signature/components/atoms/signature-element/SignatureElement.svelte';

	export let daoData: DAOProject;

	console.log(daoData);

	const mainHolders = Object.entries(daoData.onChainData.balances)
		.sort((a, b) => Number(b[1]) - Number(a[1]))
		.slice(0, 6);
	const mainHoldersAccounts = mainHolders.map((holder) => holder[0]);
	const mainHoldersAmounts = mainHolders.map((holder) => Number(holder[1]));

	const mainFunders = Object.entries(daoData.onChainData.funders)
		.sort((a, b) => Number(b[1]) - Number(a[1]))
		.slice(0, 6);
	const mainFundersAccounts = mainFunders.map((holder) => holder[0]);
	const mainFundersAmounts = mainFunders.map((holder) => Number(holder[1]));

	const currentFundingCycleData = daoData.onChainData.currentFundingCycle
		? getFundingCycleData(daoData, Number(daoData.onChainData.currentFundingCycle))
		: null;

	let fundingPerMonth: {
		labels: string[];
		data: number[];
	} | null = null;

	const recentActivity = daoData.events
		? daoData.events.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6)
		: [];
</script>

{#if daoData}
	<div class="column-6">
		<div class="boxes-wrapper">
			{#if $user.addr}
				<DataCard
					title="Your Balance"
					data={daoData.userBalance}
					isCurrency
					currencyName={daoData.generalInfo.token_symbol}
				/>
			{/if}
			<DataCard
				title="Circulating Supply"
				data={Number(daoData.onChainData.totalSupply)}
				isCurrency
				currencyName={daoData.generalInfo.token_symbol}
			/>
			<DataCard title="Total Funding" data={Number(daoData.onChainData.totalFunding)} isCurrency />
		</div>
		{#if daoData.onChainData.fundingCycles.length > 0}
			<FundingStats
				fundingCycleData={currentFundingCycleData}
				projectCurrency={daoData.generalInfo.token_symbol}
			/>
		{/if}
		<div class="card">
			<Tabs>
				<TabList>
					<Tab>Main holders</Tab>
					<Tab>Main funders</Tab>
				</TabList>
				<TabPanel>
					<div class="panel-container">
						{#if mainHoldersAmounts.length < 1}
							<span><em>This token has no holders yet</em></span>
						{:else}
							<div class="chart-wrapper">
								<PieChart
									title="Token distribution"
									chartData={mainHoldersAmounts}
									labels={mainHoldersAccounts}
								/>
							</div>
						{/if}
					</div>
				</TabPanel>
				<TabPanel>
					<div class="panel-container">
						{#if mainFundersAmounts.length < 1}
							<span><em>This token has no funders yet</em></span>
						{:else}
							<div class="chart-wrapper">
								<PieChart
									title="Token distribution"
									chartData={mainFundersAmounts}
									labels={mainFundersAccounts}
								/>
							</div>
						{/if}
					</div>
				</TabPanel>
			</Tabs>
		</div>
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
					<RecentActivity events={recentActivity} />
				</TabPanel>
				<TabPanel>
					{#each daoData.onChainData.signers as signer, i}
						<SignatureElement address={signer} {i} />
					{/each}
				</TabPanel>
				{#if fundingPerMonth}
					<TabPanel>
						<MainFunders {daoData} />
					</TabPanel>
				{/if}
				{#if daoData.onChainData.fundingCycles.length > 0}
					<TabPanel>
						<div class="rounds-wrapper">
							{#each daoData.onChainData.fundingCycles as round}
								<RoundDetail {round} i={0} />
							{/each}
						</div>
					</TabPanel>
				{/if}
			</Tabs>
		</div>
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

	.panel-container {
		display: flex;
		justify-content: center;
		min-height: var(--space-20);
		align-items: center;

		em {
			color: var(--clr-text-off);
		}

		.chart-wrapper {
			margin-top: var(--space-6);
			position: relative;
			width: 40vw;
			align-self: center;

			@include mq('medium') {
				width: auto;
				max-width: 400px;
			}
		}
	}

	.rounds-wrapper {
		display: flex;
		flex-direction: column;
	}

	.tabs-wrapper {
		min-height: 400px;
	}
</style>
