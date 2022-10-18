<script>
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

<Column align="flex-start">
	<LineChart
		title="Funding"
		chartData={[10, 20, 35, 76, 140, 200, 310]}
		labels={['January', 'February', 'March', 'April', 'May', 'June', 'July']}
	/>
	<Tabs {tabs} />
</Column>
