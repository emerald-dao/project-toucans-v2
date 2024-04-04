<script type="ts">
	import type { DaoRankingData } from '../types/dao-ranking-data.interface';
	import TokenRankingRow from './atoms/TokenRankingRow.svelte';

	export let projectsData: DaoRankingData[];
</script>

<div class="table-wrap">
	<p class="note">For your token to be on this list, it must be tradeable on <a href="https://app.increment.fi" target="_blank" style="text-decoration: none;">Increment Fi</a>, have a minimum of 50 FLOW/USDC (depending on your chosen currency) in the liquidity pool, and a minimum price of $0.00001 USD.</p>
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
				<th>Holders</th>
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
	.note {
		font-size: var(--font-size-0);
		font-style: italic;
		line-height: var(--paragraph-small-regular-line-height);
		margin-top: 5px;
	}

	.table {
		width: 100%;
		border-spacing: 0 var(--space-5);

		th {
			color: var(--clr-text-main);
			font-size: var(--font-size-0);
			text-align: right;
			padding: 2px;
		}

		.left-align {
			text-align: left;
		}
	}
</style>
