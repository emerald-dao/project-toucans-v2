<script type="ts">
	import { Doughnut } from 'svelte-chartjs';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
	import { theme } from '$stores/ThemeStore';
	import { onMount } from 'svelte';
	import { setPieChartColors } from './setChartColors';

	export let title: string;
	export let chartData = [20, 10, 20, 30, 45];
	export let labels = ['January', 'February', 'March', 'April', 'May'];

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	let chart: ChartJS | undefined;

	const updateChart = () => {
		if (chart != undefined) {
			setPieChartColors(chart);
		}
	};

	onMount(() => {
		chart = ChartJS.getChart(`pie-chart-${title}`) as ChartJS;
		setPieChartColors(chart);
	});

	$: $theme && updateChart();

	let data = {
		labels,
		datasets: [
			{
				label: title,
				data: chartData,
				cutout: '92%',
				borderWidth: '1',
				borderRadius: 7,
				spacing: 10,
				hoverOffset: 12,
				circumference: 180,
				rotation: 270
			}
		]
	};

	const options = {
		responsive: true,
		layout: {
			padding: 50
		},
		plugins: {
			legend: {
				position: 'top',
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

<Doughnut {data} {options} id={`pie-chart-${title}`} />
