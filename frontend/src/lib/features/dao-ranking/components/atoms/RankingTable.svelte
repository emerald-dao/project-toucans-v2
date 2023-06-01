<script type="ts">
	import LineChart from '$components/charts/LineChart.svelte';

	export let projectsData;

	console.log(projectsData.index);
</script>

<div class="table-wrap">
	<table class="table table-bordered table-dark table-hover">
		<thead>
			<tr>
				<th>#</th>
				<th>Name</th>
				<th>Price</th>
				<th>1 hour</th>
				<th>1 day</th>
				<th>1 week</th>
				<th>Circulating Supply</th>
				<th>Last 7 days</th>
			</tr>
		</thead>
		<tbody>
			{#each projectsData as project}
				<tr>
					<th scope="row">{project.number}</th>
					<td>{project.name}</td>
					<td>{project.price}</td>
					<td>{project.hour}</td>
					<td>{project.day}</td>
					<td>{project.week}</td>
					<td>{project.circulatingSupply}</td>
					<td>
						<LineChart
							title={project.chart.title}
							chartData={project.chart.numbers}
							labels={project.chart.labels}
						/>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style type="scss">
	.table {
		width: 100%;
	}
	.table thead th {
		border: none;
		padding: 0 var(--space-3) var(--space-4) var(--space-3);
		color: var(--clr-heading-main);
	}
	.table tbody tr {
		margin-bottom: var(--space-4);
	}
	.table tbody th,
	.table tbody td {
		width: calc(100% / 8) !important;
		border: none;
		padding: 0 var(--space-3) var(--space-4) var(--space-3);
		text-align: center;
	}
</style>
