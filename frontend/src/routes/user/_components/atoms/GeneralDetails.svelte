<script lang="ts">
	import PieChart from '$components/charts/PieChart.svelte';
	import EventsList from '$components/dao-data-blocks/events/EventsList.svelte';
	import Icon from '@iconify/svelte';
	import { mockDaoData } from './mockdata';

	const holdingDaos = ['Emerald City', 'Toucans', 'Ballerz'];
	const holdingAmounts = [100, 200, 300];
</script>

<div class="column-12 align-center">
	<div class="top-section-wrapper">
		<div class="column-space-between column-5">
			<div class="card">Some data</div>
			<div class="card">Other data</div>
			<div class="card">Other data</div>
		</div>
		<div class="chart-wrapper">
			<PieChart title="Token distribution" chartData={holdingAmounts} labels={holdingDaos} />
		</div>
	</div>
	<div class="column-2 transactions-wrapper">
		<span class="small">
			<Icon icon="tabler:activity" />
			Last transactions
		</span>
		<EventsList daoData={mockDaoData} pageSize={4} />
	</div>
</div>

<style lang="scss">
	.top-section-wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-8);

		.card {
			padding: var(--space-6);
			display: flex;
			align-items: center;
			flex: 1;
		}

		.chart-wrapper {
			max-width: 20rem;
		}
	}

	.transactions-wrapper {
		width: 100%;

		span {
			border-bottom: 0.5px solid var(--clr-border-primary);
			padding-bottom: var(--space-2);
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: var(--space-1);
		}
	}
</style>
