<script lang="ts">
	import PieChart from '$components/charts/PieChart.svelte';
	import { Currency } from '@emerald-dao/component-library';
	import DashboardHeading from '../../../atoms/DashboardHeading.svelte';
	import type { UserData } from '../../../../_types/user-data.interface';
	import { onMount } from 'svelte';

	export let userData: UserData;

	const vaults = [...userData.vaults];

	vaults.sort((a, b) => {
		return b.balance * b.tokenValue - a.balance * a.tokenValue;
	});

	const topThreeVaults = vaults.slice(0, 3);

	// If some of the vaults balance is 0, remove them from the array
	topThreeVaults.forEach((vaultData, index) => {
		if (Number(vaultData.balance) === 0) {
			topThreeVaults.splice(index, 1);
		}
	});

	const holdingDaos = topThreeVaults.map((vaultData) => {
		return vaultData.daoData.name;
	});

	const holdingAmounts = topThreeVaults.map((vaultData) => {
		return vaultData.balance * vaultData.tokenValue;
	});

	const otherVaults = vaults.slice(3);

	const otherVaultsValue = otherVaults.reduce((acc, cur) => {
		return acc + cur.balance * cur.tokenValue;
	}, 0);

	if (otherVaultsValue > 0) {
		holdingDaos.push('Other');
		holdingAmounts.push(otherVaultsValue);
	}

	let totalBalance = 0;
	let flowDonated = 0;
	let usdcDonated = 0;
	let flowFunded = 0;
	let usdcFunded = 0;

	onMount(() => {
		vaults.map((vaultData) => {
			totalBalance += vaultData.balance * vaultData.tokenValue;
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
	<div class="column-7 justify-center balances-wrapper">
		<div class="currency-wrapper large">
			<DashboardHeading>Total Balance</DashboardHeading>
			<Currency
				amount={totalBalance}
				moneyPrefix={true}
				color="heading"
				fontSize="var(--font-size-7)"
			/>
		</div>
		<div class="column-4">
			<div class="currency-wrapper">
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
			<div class="currency-wrapper">
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
		<DashboardHeading>Token Distribution</DashboardHeading>
		{#if totalBalance > 0}
			<PieChart title="Token allocation" chartData={holdingAmounts} labels={holdingDaos} />
		{:else}
			<span class="small"><em>This wallet has no tokens</em></span>
		{/if}
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		@include mq('small') {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--space-9);
			padding: var(--space-8);
		}

		.balances-wrapper {
			padding-right: var(--space-6);
			padding-block: var(--space-3);

			@include mq('small') {
				border-right: 0.5px solid var(--clr-border-primary);
			}

			.currency-wrapper {
				display: flex;
				flex-direction: column;
				gap: var(--space-1);

				@include mq('small') {
					align-items: flex-end;
				}

				&.large {
					gap: var(--space-3);
				}

				h5 {
					font-size: var(--font-size-1);
					color: var(--clr-text-primary);
					margin: 0;
				}
			}
		}

		.chart-wrapper {
			display: none;

			@include mq('small') {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				max-width: 15rem;
			}
		}
	}

	em {
		color: var(--clr-text-off);
	}
</style>
