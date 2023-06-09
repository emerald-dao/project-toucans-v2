<script lang="ts">
	import EventsList from '$components/dao-data-blocks/events/EventsList.svelte';
	import Icon from '@iconify/svelte';
	import { mockDaoData } from './mockdata';
	import PieChart from '$components/charts/PieChart.svelte';
	import { Currency } from '@emerald-dao/component-library';
	import UserBadge from './UserBadge.svelte';

	const holdingDaos = ['Emerald City', 'Toucans', 'Ballerz'];
	const holdingAmounts = [100, 200, 300];
</script>

<div class="column-12 align-center">
	<div class="top-section-wrapper">
		<div class="column-space-between column-5">
			<div class="column-10 balance-wrapper">
				<div class="column-3 ">
					<h4>Total Balance</h4>
					<Currency
						amount={709230}
						moneyPrefix={true}
						color="heading"
						fontSize="var(--font-size-7)"
					/>
				</div>
				<div class="column-3">
					<h4>Total Funded</h4>
					<Currency
						amount={895345}
						moneyPrefix={true}
						color="heading"
						fontSize="var(--font-size-7)"
					/>
				</div>
				<div class="column-2">
					<h4>Badges</h4>
					<div class="badges-wrapper">
						<UserBadge />
						<UserBadge />
						<UserBadge />
						<UserBadge />
						<UserBadge />
					</div>
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
		<EventsList daoData={mockDaoData} pageSize={4} />
	</div>
</div>

<style lang="scss">
	h4 {
		font-size: var(--font-size-2);
		color: var(--clr-text-main);
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
	}

	.top-section-wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-11);

		.balance-wrapper {
			margin-bottom: var(--space-4);
		}

		.badges-wrapper {
			display: flex;
			flex-direction: row;
			gap: var(--space-3);
			flex-wrap: wrap;
		}

		.card {
			padding: var(--space-6);
			display: flex;
			align-items: center;
			flex: 1;
		}

		.chart-wrapper {
			max-width: 19rem;
			background-color: var(--clr-background-secondary);
			border: none;
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
