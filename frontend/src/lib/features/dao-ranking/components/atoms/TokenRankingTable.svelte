<script type="ts">
	import LineChart from '$components/charts/LineChart.svelte';
	import type { DaoRankingData } from '../../types/dao-ranking-data.interface';
	import TokenRankingRow from './TokenRankingRow.svelte';

	export let projectsData: DaoRankingData[];
</script>

<div class="table-wrap">
	<table class="table table-bordered table-dark table-hover">
		<thead>
			<tr>
				<th>#</th>
				<th>Symbol</th>
				<th>DAO Name</th>
				<th>Circulating Supply</th>
				<th>Max Supply</th>
				<th>Price</th>
				<th>Market Cap</th>
				<th># Holders</th>
			</tr>
		</thead>
		<tbody>
			{#each projectsData as project, i}
				<TokenRankingRow {project} number={i} />
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
