<script>
	import RankingTable from './atoms/RankingTable.svelte';

	let projectsData = [
		{
			number: 1,
			name: 'Dao1',
			price: 300,
			hour: 2,
			day: 1,
			week: 0,
			circulatingSupply: 120,
			chart: {
				title: 'Prueba',
				numbers: [2, 4, 5, 7, 8, 9, 10],
				labels: ['', '', '', '', '', '', '']
			}
		},
		{
			number: 2,
			name: 'Dao2',
			price: 4500,
			hour: 6,
			day: 7,
			week: 5,
			circulatingSupply: 300,
			chart: {
				title: 'Prueba',
				numbers: [2, 4, 5, 7, 3, 9, 6],
				labels: ['', '', '', '', '', '', '']
			}
		}
	];
</script>

<section class="container">
	<div class="card">
		<div class="dao-wrapper">
			<RankingTable {projectsData} />
		</div>
	</div>
</section>
