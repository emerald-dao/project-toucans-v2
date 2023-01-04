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

	export let title: string;
	export let chartData = [20, 10, 5, 2, 20, 30, 45];
	export let labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

	let chart: ChartJS | undefined;

	const updateChart = () => {
		if (chart != undefined) {
			setLineChartColors(chart);
		}
	};

	onMount(() => {
		chart = ChartJS.getChart(`line-chart-${title}`) as ChartJS;
		setLineChartColors(chart);
	});

	$: $theme && updateChart();

	const data = {
		labels,
		datasets: [
			{
				label: title,
				fill: true,
				lineTension: 0.3,
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointStyle: 'circle',
				pointBorderWidth: 5,
				pointHoverRadius: 5,
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

<Line {data} {options} id={`line-chart-${title}`} />
