<script lang="ts">
	import EventsList from '$components/dao-data-blocks/events/EventsList.svelte';
	import Icon from '@iconify/svelte';
	import { mockDaoData } from './mockdata';
	import PieChart from '$components/charts/PieChart.svelte';
	import { Currency } from '@emerald-dao/component-library';

	const holdingDaos = ['Emerald City', 'Toucans', 'Ballerz'];
	const holdingAmounts = [100, 200, 300];
</script>

<div class="column-space-between align-center">
	<div class="top-section-wrapper">
		<div class="column-10 align-end">
			<div class="column-3 align-end">
				<h4>Total Balance</h4>
				<Currency
					amount={709230}
					moneyPrefix={true}
					color="heading"
					fontSize="var(--font-size-7)"
				/>
			</div>
			<div class="column-6">
				<div class="column-2 align-end">
					<h4>Total Funded</h4>
					<Currency
						amount={895345}
						moneyPrefix={true}
						color="heading"
						fontSize="var(--font-size-5)"
					/>
				</div>
				<div class="column-2 align-end">
					<h4>Total Donated</h4>
					<Currency
						amount={895345}
						moneyPrefix={true}
						color="heading"
						fontSize="var(--font-size-5)"
					/>
				</div>
			</div>
		</div>
		<div class="chart-wrapper card column-2">
			<h4>Asset Distribution</h4>
			<PieChart title="Token allocation" chartData={holdingAmounts} labels={holdingDaos} />
		</div>
	</div>
	<div class="column-2 transactions-wrapper">
		<h4 class="small">
			<Icon icon="tabler:activity" />
			Recent transactions
		</h4>
		<EventsList daoData={mockDaoData} pageSize={4} addEventButton={false} />
	</div>
</div>

<style lang="scss">
	h4 {
		font-size: var(--font-size-2);
		color: var(--clr-text-off);
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
	}

	.top-section-wrapper {
		display: grid;
		grid-template-columns: 2fr 3fr;
		gap: var(--space-12);

		.card {
			padding: var(--space-7);
			display: flex;
			align-items: center;
			flex: 1;
		}

		.chart-wrapper {
			max-width: 21rem;
		}
	}

	.transactions-wrapper {
		width: 100%;
	}
</style>
