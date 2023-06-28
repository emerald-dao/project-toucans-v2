<script lang="ts">
	import LineChart from '$components/charts/LineChart.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;

	daoData.recentFunding = [32, 543, 543, 234, 999];
</script>

<LineChart
	title={`${daoData.generalInfo.name}-chart`}
	chartData={daoData.recentFunding}
	labels={Array(daoData.recentFunding.length).fill('')}
/>
