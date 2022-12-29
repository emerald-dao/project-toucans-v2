<script type="ts">
	import ChartTitle from './../atoms/ChartTitle.svelte';
	import type { CommunityDao } from '$lib/types/dao-project.interface';
	import RecentActivity from '../atoms/RecentActivity.svelte';
	import MainHolders from '../atoms/MainHolders.svelte';
	import { Tabs, Tab, TabList, TabPanel } from '@emerald-dao/component-library';

	export let daoData: CommunityDao;
</script>

<div class="column-10">
	<div class="main-wrapper card column-8">
		<ChartTitle
			title="Token Distribution"
			data={`${daoData.token} Token`}
			icon="tabler:activity-heartbeat"
		/>
		<div class="card-primary total-tokens-card column-0">
			<span class="xsmall">Total Tokens</span>
			<span class="large">{daoData.totalTokens.toLocaleString()}</span>
		</div>
	</div>
	<Tabs>
		<TabList>
			<Tab>Recent Activity</Tab>
			<Tab>Main MainHolders</Tab>
		</TabList>
		<TabPanel>
			<RecentActivity />
		</TabPanel>
		<TabPanel>
			<MainHolders />
		</TabPanel>
	</Tabs>
</div>

<style type="scss">
	.main-wrapper {
		height: fit-content;

		.total-tokens-card {
			padding: var(--space-4);
			width: fit-content;
			border: none;

			span:not(:first-child) {
				color: var(--clr-heading-main);
			}
		}
	}
</style>
