<script type="ts">
	import { Doughnut } from 'svelte-chartjs';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
	import { theme } from '$stores/ThemeStore';
	import { onMount } from 'svelte';

	export let title: string;
	export let chartData = [20, 10, 20, 30, 45];
	export let labels = ['January', 'February', 'March', 'April', 'May'];
	// export let backgroundColor = ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360', '#AC64AD'];
	// export let hoverBackgroundColor = [
	// 	'#FF5A5E',
	// 	'#5AD3D1',
	// 	'#FFC870',
	// 	'#A8B3C5',
	// 	'#616774',
	// 	'#DA92DB'
	// ];
	let backgroundColor: string[] = [];
	let hoverBackgroundColor: string[] = [];

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	let chart: ChartJS | undefined;
	let style: CSSStyleDeclaration;
	let borderColor: string;

	const updateChart = () => {
		if (chart != undefined) {
			style = getComputedStyle(document.body);
			borderColor = style.getPropertyValue('--clr-border-secondary');
			chart.options.borderColor = borderColor;

			chart.update();
		}
	};

	onMount(() => {
		chart = ChartJS.getChart(`pie-chart-${title}`) as ChartJS;

		style = getComputedStyle(document.body);
		borderColor = style.getPropertyValue('--clr-border-secondary');
		chart.options.borderColor = borderColor;

		backgroundColor.push(style.getPropertyValue('--clr-neutral-50'));
		backgroundColor.push(style.getPropertyValue('--clr-neutral-100'));
		backgroundColor.push(style.getPropertyValue('--clr-neutral-200'));
		backgroundColor.push(style.getPropertyValue('--clr-neutral-300'));
		backgroundColor.push(style.getPropertyValue('--clr-neutral-400'));
		backgroundColor.push(style.getPropertyValue('--clr-neutral-500'));
		backgroundColor.push(style.getPropertyValue('--clr-neutral-600'));
		backgroundColor.push(style.getPropertyValue('--clr-neutral-700'));
		backgroundColor.push(style.getPropertyValue('--clr-neutral-800'));
		backgroundColor.push(style.getPropertyValue('--clr-neutral-900'));

		chart.options.backgroundColor = backgroundColor;

		hoverBackgroundColor.push(style.getPropertyValue('--clr-primary-main'));

		chart.options.hoverBackgroundColor = hoverBackgroundColor;

		chart.update();
	});

	let data = {
		labels,
		datasets: [
			{
				label: title,
				data: chartData,
				cutout: '90%',
				borderWidth: '1',
				borderRadius: 7,
				spacing: 10,
				hoverOffset: 12,
				circumference: 180,
				rotation: 270
			}
		]
	};

	let options = {
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

	$: $theme && updateChart();
</script>

<Doughnut {data} {options} id={`pie-chart-${title}`} />
