<script lang="ts">
	import PieChart from '$components/charts/PieChart.svelte';
	import { Currency } from '@emerald-dao/component-library';
	import DashboardHeading from '../../../atoms/DashboardHeading.svelte';
	import type { UserData } from '../../../../_types/user-data.interface';
	import { getContext, onMount } from 'svelte';

	const userData: UserData = getContext('userData');

	const holdingDaos = userData.vaults.map((vaultData) => {
		return vaultData.daoData.name;
	});

	const holdingAmounts = userData.vaults.map((vaultData) => {
		return vaultData.balance;
	});

	let totalBalance = 0;
	let flowDonated = 0;
	let usdcDonated = 0;
	let flowFunded = 0;
	let usdcFunded = 0;

	onMount(() => {
		userData.vaults.map((vaultData) => {
			totalBalance += vaultData.balance / vaultData.tokenValue;
		});

		userData.transactions.map((transaction) => {
			if (transaction.type === 'Donate') {
				if (transaction.data.tokenSymbol === 'FLOW') {
					flowDonated += Number(transaction.data.amount);
				} else if (transaction.data.tokenSymbol === 'USDC') {
					usdcDonated += Number(transaction.data.amount);
				}
			} else if (transaction.type === 'Purchase') {
				if (transaction.data.tokenSymbol === 'FLOW') {
					flowFunded += Number(transaction.data.amount);
				} else if (transaction.data.tokenSymbol === 'USDC') {
					usdcFunded += Number(transaction.data.amount);
				}
			}
		});
	});
</script>

<div class="main-wrapper card">
	<div class="column-7 align-end justify-center balances-wrapper">
		<div class="column-3 align-end">
			<DashboardHeading>Total Balance</DashboardHeading>
			<Currency
				amount={totalBalance}
				moneyPrefix={true}
				color="heading"
				fontSize="var(--font-size-7)"
			/>
		</div>
		<div class="column-4">
			<div class="column-1 align-end">
				<h5>Total Funding</h5>
				<Currency
					amount={flowFunded}
					currency="FLOW"
					color="heading"
					fontSize="var(--font-size-3)"
				/>
				<Currency
					amount={usdcFunded}
					currency="USDC"
					color="heading"
					fontSize="var(--font-size-3)"
				/>
			</div>
			<div class="column-1 align-end">
				<h5>Total Donations</h5>
				<Currency
					amount={flowDonated}
					currency="FLOW"
					color="heading"
					fontSize="var(--font-size-3)"
				/>
				<Currency
					amount={usdcDonated}
					currency="USDC"
					color="heading"
					fontSize="var(--font-size-3)"
				/>
			</div>
		</div>
	</div>
	<div class="chart-wrapper column-2">
		<DashboardHeading>Asset Distribution</DashboardHeading>
		<PieChart title="Token allocation" chartData={holdingAmounts} labels={holdingDaos} />
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-9);
		padding: var(--space-8);

		.balances-wrapper {
			border-right: 1px solid var(--clr-neutral-badge);
			padding-right: var(--space-8);
			padding-block: var(--space-3);

			h5 {
				font-size: var(--font-size-1);
				color: var(--clr-text-off);
				margin: 0;
			}
		}

		.chart-wrapper {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			max-width: 15rem;
		}
	}
</style>
