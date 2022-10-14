<script>
	import { Line } from 'svelte-chartjs';

	export let title;
	export let chartData;
	export let labels;

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

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

	const data = {
		labels,
		datasets: [
			{
				label: title,
				fill: true,
				lineTension: 0.3,
				backgroundColor: '#34E7C3',
				borderColor: '#34E7C3',
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: '#34E7C3',
				pointBackgroundColor: '#34E7C3',
				pointBorderWidth: 10,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: 'rgb(0, 0, 0)',
				pointHoverBorderColor: '#34E7C3',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: chartData
			}
		]
	};
</script>

<Line {data} options={{ responsive: true }} />
