<script lang="ts">
	import LineChart from '$components/charts/LineChart.svelte';
	import { Currency } from '@emerald-dao/component-library';
	import type { DaoRankingData } from '../../types/dao-ranking-data.interface';
	import PercentageVariation from './PercentageVariation.svelte';
	import { formatFix } from '$flow/utils';

	export let project: DaoRankingData;
	console.log(project.numbers);
</script>

<tr>
	<th scope="row">{project.number}</th>
	<td>{project.name}</td>

	<td><PercentageVariation variation={project.hour} /></td>
	<td><PercentageVariation variation={project.day} /></td>
	<td><PercentageVariation variation={project.week} /></td>

	<td
		><Currency
			amount={project.circulating_supply}
			currency={project.token_symbol}
			color="heading"
		/></td
	>
	<td>
		{#if project.price}
			<Currency amount={project.price} currency={project.payment_currency} color="heading" />
		{:else}
			N/A
		{/if}
	</td>
	<td>
		{#if project.price}
			<Currency
				amount={Math.round(project.circulating_supply * project.price * 100) / 100}
				currency={project.payment_currency}
				color="heading"
			/>
		{:else}
			N/A
		{/if}
	</td>
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
