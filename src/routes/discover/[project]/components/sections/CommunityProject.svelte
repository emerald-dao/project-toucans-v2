<script type="ts">
	import ChartTitle from './../atoms/ChartTitle.svelte';
	import Tabs from '$components/atoms/Tabs.svelte';
	import type { CommunityDao } from '$lib/types/dao-project.interface';
	import MainFounders from '../atoms/MainFounders.svelte';
	import RecentActivity from '../atoms/RecentActivity.svelte';

	export let daoData: CommunityDao;

	let tabs = [
		{
			name: 'Recent Activity',
			component: RecentActivity
		},
		{
			name: 'Main Founders',
			component: MainFounders
		}
	];
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
	<Tabs {tabs} />
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
