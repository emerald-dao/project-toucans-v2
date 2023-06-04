<script type="ts">
	import LineChart from '$components/charts/LineChart.svelte';
	import type { DaoRankingData } from '../../types/dao-ranking-data.interface';
	import DaoRankingRow from './DaoRankingRow.svelte';

	export let projectsData: DaoRankingData[];
</script>

<div class="table-wrap">
	<table class="table table-bordered table-dark table-hover">
		<thead>
			<tr>
				<th>#</th>
				<th>Name</th>
				<th>Total Funding</th>
				<th>Treasury Value</th>
				<th># Proposals</th>
				<th># Holders</th>
				<th>7d Funding</th>
			</tr>
		</thead>
		<tbody>
			{#each projectsData as project, i}
				<DaoRankingRow {project} number={i} />
			{/each}
		</tbody>
	</table>
</div>

<style type="scss">
	.table {
		width: 100%;

		th {
			color: var(--clr-text-main);
			font-size: var(--font-size-0);
		}
	}
</style>
