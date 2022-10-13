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
				backgroundColor: 'green',
				borderColor: 'green',
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: 'white',
				pointBackgroundColor: 'white',
				pointBorderWidth: 10,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: 'rgb(0, 0, 0)',
				pointHoverBorderColor: 'rgba(220, 220, 220,1)',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: chartData
			}
		]
	};
</script>

<Line {data} options={{ responsive: true }} />
