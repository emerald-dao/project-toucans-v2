<script lang="ts">
	import type { UserData } from './../../../_types/user-data.interface';
	import { fly } from 'svelte/transition';
	import { Currency } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import TransactionsList from '../../atoms/TransactionsList.svelte';

	const userData: UserData = getContext('userData');
	const selectedVaultStore: Writable<number> = getContext('selectedVault');

	$: vault = $selectedVaultStore > 0 ? userData.vaults[$selectedVaultStore - 1] : null;

	$: transactions =
		$selectedVaultStore > 0
			? userData.transactions.filter(
					(transaction) => transaction.project_id === vault?.daoData.contractName
			  )
			: null;

	const handleCloseVault = () => {
		selectedVaultStore.set(0);
	};

	const handleNextVault = () => {
		selectedVaultStore.update((value) => value + 1);
	};

	const handlePrevVault = () => {
		selectedVaultStore.update((value) => value - 1);
	};
</script>

{#if vault}
	<div class="main-wrapper column-10" transition:fly|local={{ x: 400, duration: 800 }}>
		<div class="close-button header-link" on:click={handleCloseVault}>
			<Icon icon="tabler:x" />
		</div>
		<div class="content-wrapper">
			<div class="card-primary">
				<div class="column-6">
					<div class="row-2 align-center">
						<img src={vault.daoData.logoUrl} alt="Emerald City Logo" class="logo" />
						<h4 class="w-medium">{vault.daoData.name}</h4>
					</div>
					<div class="row-5 align-end">
						<Currency
							amount={vault.balance}
							currency={vault.daoData.tokenSymbol}
							fontSize="var(--font-size-6)"
							decimalNumbers={2}
							color="heading"
						/>
						<Currency
							amount={vault.balance / vault.tokenValue}
							moneyPrefix={true}
							fontSize="var(--font-size-3)"
							decimalNumbers={2}
						/>
					</div>
				</div>
				<div class="column-space-between">
					<div class="header-link" on:click={handlePrevVault}>
						<Icon icon="tabler:arrow-up" />
					</div>
					<div class="header-link" on:click={handleNextVault}>
						<Icon icon="tabler:arrow-down" />
					</div>
				</div>
			</div>
			{#if transactions}
				<div class="events-wrapper">
					<TransactionsList events={transactions} />
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.main-wrapper {
		position: fixed;
		right: 0;
		background-color: var(--clr-background-secondary);
		height: 100%;
		min-width: 50vw;

		.content-wrapper {
			padding: var(--space-14);
			display: flex;
			flex-direction: column;
			gap: var(--space-6);
			flex: 1;

			.card-primary {
				border-color: var(--clr-neutral-badge);
				background: linear-gradient(
						to right,
						rgba(18, 18, 18, 0.97),
						rgba(18, 18, 18, 1),
						rgba(18, 18, 18, 0.98),
						rgba(18, 18, 18, 0.9)
					),
					url(/toucans-illustration.png);
				background-size: cover;
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				h3 {
					display: flex;
					flex-direction: row;
					align-items: center;
					gap: var(--space-1);
					color: var(--clr-text-main);
					font-size: var(--font-size-3);
				}

				.logo {
					width: 50px;
					height: 50px;
					border-radius: 50%;
				}

				h4 {
					font-size: var(--font-size-5);
				}
			}

			.events-wrapper {
				padding-inline: var(--space-6);
			}
		}

		.close-button {
			position: absolute;
			left: 20px;
			top: 20px;
		}
	}
</style>
