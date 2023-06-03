<script type="ts">
	import LineChart from '$components/charts/LineChart.svelte';
	import type { DaoRankingData } from '../../types/dao-ranking-data.interface';
	import RankingRow from './RankingRow.svelte';

	export let projectsData: DaoRankingData[];
</script>

<div class="table-wrap">
	<table class="table table-bordered table-dark table-hover">
		<thead>
			<tr>
				<th>#</th>
				<th>Name</th>
				<th>1h</th>
				<th>1d</th>
				<th>7d</th>
				<th>Circulating Supply</th>
				<th>Price</th>
				<th>Market Cap</th>
				<th>7 day Funding</th>
			</tr>
		</thead>
		<tbody>
			{#each projectsData as project}
				<RankingRow {project} />
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
