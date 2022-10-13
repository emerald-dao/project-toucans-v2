<script>
	import LineChart from '$components/charts/LineChart.svelte';
</script>

<div>
	<LineChart
		title="Funding"
		chartData={[10, 20, 35, 76, 140, 200, 310]}
		labels={['January', 'February', 'March', 'April', 'May', 'June', 'July']}
	/>
</div>
