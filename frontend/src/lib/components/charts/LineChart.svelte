<script type="ts">
	import { Line } from 'svelte-chartjs';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale
	} from 'chart.js';
	import { setLineChartColors } from './setChartColors';
	import { onMount } from 'svelte';
	import { theme } from '$stores/ThemeStore';
	import { hyphenateAndLowerCase } from '$lib/utilities/formatStrings';

	export let title: string;
	export let chartData: number[];
	export let labels: string[];

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

	let chart: ChartJS | undefined;

	const updateChart = () => {
		if (chart != undefined) {
			setLineChartColors(chart);
		}
	};

	onMount(() => {
		chart = ChartJS.getChart(`line-chart-${hyphenateAndLowerCase(title)}`) as ChartJS;
		setLineChartColors(chart);
	});

	$: $theme && updateChart();

	$: data = {
		labels,
		datasets: [
			{
				lineTension: 0.1,
				borderWidth: 2,
				borderJoinStyle: 'miter' as 'miter' | 'bevel' | 'round',
				data: chartData,
				pointRadius: 0
			}
		]
	};

	const options = {
		responsive: true,
		scales: {
			y: {
				ticks: {
					display: false
				},
				grid: {
					display: false,
					drawTicks: false,
					drawBorder: false,
					drawOnChartArea: false
				}
			},
			x: {
				grid: {
					display: false,
					drawBorder: false,
					drawTicks: false,
					drawOnChartArea: false
				}
			}
		},
		plugins: {
			legend: {
				display: false
			}
		}
	};
</script>

<Line {data} {options} id={`line-chart-${hyphenateAndLowerCase(title)}`} />
