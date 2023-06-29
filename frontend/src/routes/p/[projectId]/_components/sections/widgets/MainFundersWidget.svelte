<script lang="ts">
	import MainFundersChart from '$components/dao-data-blocks/funders/chart/MainFundersChart.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;
</script>

<div class="card">
	<span class="xsmall">Main Funders</span>
	<MainFundersChart {daoData} />
</div>

<style lang="scss">
	.card {
		flex: 1;
	}
</style>
