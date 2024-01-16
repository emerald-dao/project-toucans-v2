<script type="ts">
	import type { DaoRankingData } from '../types/dao-ranking-data.interface';
	import TokenRankingRow from './atoms/TokenRankingRow.svelte';

	export let projectsData: DaoRankingData[];
</script>

<div class="table-wrap">
	<table class="table table-bordered table-dark table-hover">
		<thead>
			<tr>
				<th class="left-align">#</th>
				<th class="left-align">Symbol</th>
				<th class="left-align">DAO Name</th>
				<th>Price</th>
				<th>Market Cap</th>
				<th>24h Volume</th>
				<th>TVL</th>
				<th>Total Supply</th>
				<th>Max Supply</th>
				<th># Holders</th>
			</tr>
		</thead>
		<tbody>
			{#each projectsData as project, i (project.project_id)}
				<TokenRankingRow {project} number={i} />
			{/each}
		</tbody>
	</table>
</div>

<style type="scss">
	.table {
		width: 100%;
		border-spacing: 0 var(--space-5);

		th {
			color: var(--clr-text-main);
			font-size: var(--font-size-0);
			text-align: right;
		}

		.left-align {
			text-align: left;
		}
	}
</style>
