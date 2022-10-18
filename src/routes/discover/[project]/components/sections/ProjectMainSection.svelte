<script>
	import ActivityDetail from '$components/activity/ActivityDetail.svelte';
	import { Tabs } from '$atoms';
	import LineChart from '$components/charts/LineChart.svelte';
	import { Column } from '@mateoroldos/svelte.bones';
	import MainFounders from '../atoms/MainFounders.svelte';
	import RecentActivity from '../atoms/RecentActivity.svelte';

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

<div class="main-wrapper">
	<LineChart
		title="Funding"
		chartData={[10, 20, 35, 76, 140, 200, 310]}
		labels={['January', 'February', 'March', 'April', 'May', 'June', 'July']}
	/>
	<Tabs {tabs} />
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: 3rem;
		max-height: 75vh;
	}
</style>
