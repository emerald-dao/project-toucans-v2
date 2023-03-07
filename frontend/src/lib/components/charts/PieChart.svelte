<script type="ts">
	import { Doughnut } from 'svelte-chartjs';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
	import { theme } from '$stores/ThemeStore';
	import { onMount } from 'svelte';
	import { setPieChartColors } from './setChartColors';
	import { hyphenateAndLowerCase } from '$lib/utilities/formatStrings';

	export let title: string;
	export let chartData: number[];
	export let labels: string[];

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	let chart: ChartJS | undefined;

	// get a random number to make chart unique
	let random = Math.floor(Math.random() * 1000);

	onMount(() => {
		chart = ChartJS.getChart(`pie-chart-${hyphenateAndLowerCase(title)}-${random}`) as ChartJS;
		setPieChartColors(chart);
	});

	export const updateChartData = (newLabel: string, newData: number) => {
		if (chart && chart.data.labels) chart.data.labels.push(newLabel);
		if (chart)
			chart.data.datasets.forEach((dataset) => {
				dataset.data.push(newData);
			});

		if (chart) chart.update();
	};

	const updateColors = () => {
		if (chart) setPieChartColors(chart);
	};

	$: $theme && updateColors();

	let data = {
		labels,
		datasets: [
			{
				label: title,
				data: chartData,
				cutout: '94%',
				borderWidth: 1,
				borderRadius: 7,
				spacing: 10,
				hoverOffset: 12,
				rotation: 270
			}
		]
	};

	const options = {
		responsive: true,
		layout: {
			padding: 10
		},
		plugins: {
			legend: {
				position: 'bottom',
				labels: {
					boxWidth: 10,
					boxHeight: 10,
					padding: 16,
					usePointStyle: true
				}
			}
		}
	};
</script>

<Doughnut {data} {options} id={`pie-chart-${hyphenateAndLowerCase(title)}-${random}`} />
