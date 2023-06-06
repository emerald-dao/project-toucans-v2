<script lang="ts">
	import LineChart from '$components/charts/LineChart.svelte';
	import { Currency } from '@emerald-dao/component-library';
	import type { DaoRankingData } from '../../types/dao-ranking-data.interface';
	import dappInfo from '$lib/config/config';

	export let project: DaoRankingData;
	export let number: number;

	console.log(project);
</script>

<tr>
	<th scope="row" class="left-align fit-content soft-text">{number + 1}</th>
	<td>
		<a
			href={`https://${dappInfo.url}/p/${project.project_id}`}
			class="row-2 align-center left-align fit-content"
		>
			<img src={project.logo} alt={`${project.name} logo`} class="logo" />
			{project.name}
		</a>
	</td>
	<td>${project.total_funding}</td>
	<td>${project.treasury_value}</td>
	<td>{project.num_proposals}</td>
	<td>{project.num_participants}</td>
	<td class="chart">
		<div class="chart-wrapper">
			<LineChart
				title={`${project.name}-chart`}
				chartData={project.numbers}
				labels={Array(project.numbers.length).fill('')}
			/>
		</div>
	</td>
</tr>

<!-- </a> -->
<style type="scss">
	tr {
		margin-block: var(--spacce-10);

		th,
		td {
			text-align: right;
			color: var(--clr-heading-main);
			font-size: var(--font-size-1);
		}

		.chart {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			// border: 1px red solid;
			overflow-y: hidden;

			.chart-wrapper {
				width: 90px;
				height: fit-content;
				margin-bottom: -18px;
			}
		}

		a {
			color: var(--clr-heading-main);
			text-decoration: none;
		}

		.fit-content {
			width: fit-content;
		}

		.soft-text {
			color: var(--clr-text-off);
		}

		.left-align {
			text-align: left;
		}

		.logo {
			width: 22px;
			height: 22px;
			border-radius: 50%;
		}
	}
</style>
