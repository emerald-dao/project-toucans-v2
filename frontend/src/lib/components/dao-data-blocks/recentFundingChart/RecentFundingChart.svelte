<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import LineChart from './../../charts/LineChart.svelte';

	export let daoData: DAOProject;

	daoData.recentFunding = [32, 543, 543, 234, 999];
</script>

<LineChart
	title={`${daoData.generalInfo.name}-chart`}
	chartData={daoData.recentFunding}
	labels={Array(daoData.recentFunding.length).fill('')}
/>
