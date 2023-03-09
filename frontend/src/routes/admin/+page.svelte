<script type="ts">
	import { fly } from 'svelte/transition';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import DataCard from '$components/atoms/cards/DataCard.svelte';
	import LineChart from '$components/charts/LineChart.svelte';
	import { getMonthlyFundingFromRounds } from '$lib/utilities/getMonthlyFundings';
	import Icon from '@iconify/svelte';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: DAOProject[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;

	$: activeDaoData = adminData.userDaos[$activeDaoStore];
	// $: fundingsPerMonth =
	// 	activeDaoData.purchaseHistory.length > 0
	// 		? getMonthlyFundingFromRounds(daoData.purchaseHistory)
	// 		: null;
</script>

<div class="main-wrapper" in:fly={{ x: 10, duration: 400 }}>
	<DataCard
		title="Token"
		data={`$${activeDaoData.generalInfo.token_symbol}`}
		hasBackground={true}
	/>
	<DataCard
		title="Circulating Supply"
		data={Number(activeDaoData.onChainData.totalFunding).toLocaleString()}
		icon="tabler:home"
	/>
	<!-- <DataCard
		title="Max Supply"
		data={Number(activeDaoData.totalSupply).toLocaleString()}
		icon="tabler:home"
	/> -->
	<div class="chart-card-wrapper">
		<DataCard
			title="Funding History"
			paddingBlock="var(--space-8)"
			icon="tabler:chart-line"
			height="100%"
		>
			<!-- {#if activeDaoData.fundingCycles && fundingsPerMonth}
				<div class="chart-wrapper">
					<LineChart
						title={`${activeDaoData.generalInfo.name} Funding`}
						chartData={fundingsPerMonth.data}
						labels={fundingsPerMonth.labels}
					/>
				</div>
			{:else}
				<div class="no-funding-wrapper">
					<Icon width="1.6rem" icon="tabler:mood-empty" />
					<span>No funding history</span>
				</div>
			{/if} -->
		</DataCard>
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-10);
		height: 100%;

		@include mq('medium') {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: auto 1fr;
			grid-column-gap: var(--space-5);
			grid-row-gap: var(--space-6);
			grid-template-areas:
				'card-1 card-2 card-3'
				'chart-card chart-card chart-card';
		}

		.chart-card-wrapper {
			grid-area: chart-card;

			.chart-wrapper {
				width: auto;
				height: 100%;
				display: grid;
				place-items: center;
			}

			.no-funding-wrapper {
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: var(--space-1);
				color: var(--clr-text-off);

				span {
					font-size: var(--font-size-2);
					font-style: italic;
				}
			}
		}
	}
</style>
