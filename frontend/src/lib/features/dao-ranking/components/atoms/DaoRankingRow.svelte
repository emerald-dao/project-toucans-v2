<script lang="ts">
	import LineChart from '$components/charts/LineChart.svelte';
	import { Currency } from '@emerald-dao/component-library';
	import type { DaoRankingData } from '../../types/dao-ranking-data.interface';

	export let project: DaoRankingData;
	export let number: number;
</script>

<tr>
	<th scope="row">{number}</th>
	<td>{project.name}</td>
	<td>${project.total_funding}</td>
	<td>${project.treasury_value}</td>
	<td>{project.num_proposals}</td>
	<td>{project.num_holders}</td>
	<td>
		<div class="chart-wrapper">
			<LineChart
				title={'Prueba'}
				chartData={project.numbers}
				labels={Array(project.numbers.length).fill('')}
			/>
		</div>
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
