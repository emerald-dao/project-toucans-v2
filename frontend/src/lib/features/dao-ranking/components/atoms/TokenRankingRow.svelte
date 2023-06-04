<script lang="ts">
	import LineChart from '$components/charts/LineChart.svelte';
	import { Currency } from '@emerald-dao/component-library';
	import type { DaoRankingData } from '../../types/dao-ranking-data.interface';

	export let project: DaoRankingData;
	export let number: number;
</script>

<tr>
	<th scope="row">{number}</th>
	<td>{project.token_symbol}</td>
	<td>{project.name}</td>
	<td>{project.circulating_supply}</td>
	<td>{project.max_supply || 'N/A'}</td>
	<td>{project.price ? `$${project.price}` : 'N/A'}</td>
	<td>
		{project.price
			? `$${Math.round(project.price * project.circulating_supply * 100) / 100}`
			: 'N/A'}
	</td>
</tr>

<style type="scss">
	th,
	td {
		width: calc(100% / 8) !important;
		text-align: center;
		color: var(--clr-heading-main);
	}

	.chart-wrapper {
		margin-top: 25px;
		width: 120px;
	}
</style>
