<script type="ts">
	import ChartTitle from './../atoms/ChartTitle.svelte';
	import type { CommunityDao } from '$lib/types/dao-project.interface';
	import RecentActivity from '../atoms/RecentActivity.svelte';
	import MainHolders from '../atoms/MainHolders.svelte';
	import { Tabs, Tab, TabList, TabPanel, Currency } from '@emerald-dao/component-library';
	import PieChart from '$components/charts/PieChart.svelte';
	import { stringToNumber } from '$lib/utilities/stringToNumber';

	export let daoData: CommunityDao;

	const mainHolderNames: string[] = Object.keys(daoData.balances);
	const mainHolderAmounts: number[] = Object.values(daoData.balances).map(stringToNumber);
</script>

<div class="column-10">
	<div class="main-wrapper card">
		<div class="column-8">
			<ChartTitle title="Token Distribution" icon="tabler:steam" />
			<div class="card-primary total-tokens-card column-0">
				<span class="xsmall">Circulating Supply</span>
				<Currency
					amount={Number(daoData.totalSupply)}
					currency={daoData.token_symbol}
					fontSize="1.3rem"
					color="heading"
				/>
			</div>
		</div>
		<div class="chart-wrapper">
			<PieChart title="Token distribution" chartData={mainHolderAmounts} labels={mainHolderNames} />
		</div>
	</div>
	<Tabs>
		<TabList>
			<Tab>Recent Activity</Tab>
			<Tab>Main Holders</Tab>
		</TabList>
		<TabPanel>
			<RecentActivity />
		</TabPanel>
		<TabPanel>
			<MainHolders {daoData} />
		</TabPanel>
	</Tabs>
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;

		@include mq('medium') {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}

		.total-tokens-card {
			padding: var(--space-4);
			width: fit-content;
			border: none;

			span:not(:first-child) {
				color: var(--clr-heading-main);
			}
		}

		.chart-wrapper {
			position: relative;
			width: 40vw;
			align-self: center;

			@include mq('medium') {
				width: auto;
			}
		}
	}
</style>
