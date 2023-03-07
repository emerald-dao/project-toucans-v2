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
				label: title,
				fill: true,
				lineTension: 0.1,
				borderWidth: 2,
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter' as 'miter' | 'bevel' | 'round',
				pointStyle: 'circle',
				pointBorderWidth: 2,
				pointHoverRadius: 2,
				pointHoverBorderWidth: 2,
				pointRadius: 2,
				pointHitRadius: 10,
				data: chartData
			}
		]
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
				labels: {
					boxHeight: 1,
					boxWidth: 20
				}
			},
			tooltip: {
				displayColors: false
			}
		}
	};
</script>

<Line {data} {options} id={`line-chart-${hyphenateAndLowerCase(title)}`} />
