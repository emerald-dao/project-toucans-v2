<script lang="ts">
	import LineChart from '$components/charts/LineChart.svelte';
	import { Currency } from '@emerald-dao/component-library';
	import type { DaoRankingData } from '../../types/dao-ranking-data.interface';
	import PercentageVariation from './PercentageVariation.svelte';

	export let project: DaoRankingData;
</script>

<tr>
	<th scope="row">{project.number}</th>
	<td>{project.name}</td>
	<td><Currency amount={project.price} currency="U$S" color="heading" /></td>

	<td><PercentageVariation variation={project.hour} /></td>
	<td><PercentageVariation variation={project.day} /></td>
	<td><PercentageVariation variation={project.week} /></td>

	<td><Currency amount={project.circulatingSupply} currency="U$S" color="heading" /></td>
	<td>
		<div class="chart-wrapper">
			<LineChart
				title={project.chart.title}
				chartData={project.chart.numbers}
				labels={project.chart.labels}
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
