<script lang="ts">
	import LineChart from '$components/charts/LineChart.svelte';
	import { Currency } from '@emerald-dao/component-library';
	import type { DaoRankingData } from '../../types/dao-ranking-data.interface';
	import { handleLogoImgError } from '$lib/utilities/handleLogoImgError';

	export let project: DaoRankingData;
	export let number: number;
</script>

<tr>
	<th scope="row" class="left-align fit-content soft-text">{number + 1}</th>
	<td>
		<a href={`/p/${project.project_id}`} class="row-2 align-center left-align fit-content">
			<img
				src={project.projects.logo}
				on:error={(e) => handleLogoImgError(e)}
				alt={`${project.projects.name} logo`}
				class="logo"
			/>
			{project.projects.name}
		</a>
	</td>
	<td>
		<Currency
			amount={project.treasury_value}
			moneyPrefix={true}
			color="heading"
			fontSize="var(--font-size-1)"
		/>
	</td>
	<td>
		<Currency
			amount={project.total_funding}
			moneyPrefix={true}
			color="heading"
			fontSize="var(--font-size-1)"
		/>
	</td>
	<td>{project.nft_count}</td>
	<td>{project.num_proposals}</td>
	<td>{project.num_participants}</td>
	<td class="chart">
		<div class="chart-wrapper">
			<LineChart
				title={`${project.projects.name}-chart`}
				chartData={project.numbers}
				labels={Array(project.numbers.length).fill('')}
			/>
		</div>
	</td>
</tr>

<style type="scss">
	tr {
		margin-block: var(--space-10);

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
