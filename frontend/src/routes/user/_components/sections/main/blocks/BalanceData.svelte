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
	<div class="column-10 align-end justify-center">
		<div class="column-3 align-end">
			<DashboardHeading>Total Balance</DashboardHeading>
			<Currency
				amount={totalBalance}
				moneyPrefix={true}
				color="heading"
				fontSize="var(--font-size-7)"
			/>
		</div>
		<div class="column-6">
			<div class="row-4">
				<div class="column-2 align-end">
					<DashboardHeading>Flow Funded</DashboardHeading>
					<Currency
						amount={flowFunded}
						moneyPrefix={true}
						color="heading"
						fontSize="var(--font-size-5)"
					/>
				</div>
				<div class="column-2 align-start">
					<DashboardHeading>USDC Funded</DashboardHeading>
					<Currency
						amount={usdcFunded}
						moneyPrefix={true}
						color="heading"
						fontSize="var(--font-size-5)"
					/>
				</div>
			</div>
			<div class="row-4">
				<div class="column-2 align-end">
					<DashboardHeading>Flow Donated</DashboardHeading>
					<Currency
						amount={flowDonated}
						moneyPrefix={true}
						color="heading"
						fontSize="var(--font-size-5)"
					/>
				</div>
				<div class="column-2 align-end">
					<DashboardHeading>USDC Donated</DashboardHeading>
					<Currency
						amount={usdcDonated}
						moneyPrefix={true}
						color="heading"
						fontSize="var(--font-size-5)"
					/>
				</div>
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
		flex: 1;
		padding: var(--space-8);

		.chart-wrapper {
			display: flex;
			flex-direction: column;
			align-items: center;
			max-width: 17rem;
		}
	}
</style>
