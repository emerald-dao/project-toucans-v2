<script lang="ts">
	import { Currency } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import DashboardHeading from '../../../atoms/DashboardHeading.svelte';
	import type { UserData } from '../../../../_types/user-data.interface';

	const userData: UserData = getContext('userData');

	const selectedVaultStore: Writable<number> = getContext('selectedVault');

	const handleSelectVault = (vaultId: number) => {
		selectedVaultStore.set(vaultId + numberOfPages * activePage);
	};

	let activePage = 0;

	const vaultsPerPage = 3;

	$: vaultsToShow = userData.vaults.slice(
		activePage * vaultsPerPage,
		(activePage + 1) * vaultsPerPage
	);
	$: numberOfPages = Math.ceil(userData.vaults.length / vaultsPerPage);

	// If the selectedVault is not inside the actual page, change the page
	$: if ($selectedVaultStore !== 0) {
		if (
			$selectedVaultStore > (activePage + 1) * vaultsPerPage ||
			$selectedVaultStore < activePage * vaultsPerPage
		) {
			activePage = Math.floor($selectedVaultStore / vaultsPerPage);
		}
	}
</script>

<div class="balances-wrapper">
	<div class="column-3">
		<DashboardHeading icon="tabler:writing-sign">Vaults</DashboardHeading>
		{#if userData.vaults.length > 0}
			{#each vaultsToShow as vault, i}
				<div class="balance-wrapper" on:click={() => handleSelectVault(i + 1)}>
					<div
						class="select-wrapper"
						class:selected={$selectedVaultStore === i + 1 + numberOfPages * activePage}
					>
						<div class="row-space-between">
							<div class="coin-name-wrapper row-2 align-center">
								<img src={vault.daoData.logoUrl} alt={`${vault.daoData.name} logo`} class="logo" />
								<h4 class:selected={$selectedVaultStore === i + 1 + numberOfPages * activePage}>
									{vault.daoData.name}
								</h4>
							</div>
							<div
								class="eye-icon"
								class:selected={$selectedVaultStore === i + 1 + numberOfPages * activePage}
							>
								<Icon icon="tabler:eye" />
							</div>
						</div>
						<div class="row-2 align-end">
							<Currency
								amount={vault.balance}
								currency={vault.daoData.tokenSymbol}
								color="heading"
								fontSize="var(--font-size-3)"
							/>
							<Currency
								amount={vault.balance * vault.tokenValue}
								moneyPrefix={true}
								color="text"
								fontSize="var(--font-size-0)"
							/>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<span class="small"><em>This user has no vaults</em></span>
		{/if}
	</div>
	{#if userData.vaults.length > vaultsPerPage}
		<div class="pagination">
			<div>
				{#if activePage > 0}
					<div on:click={() => (activePage -= 1)} class="header-link">
						<Icon icon="tabler:arrow-left" />
					</div>
				{/if}
			</div>
			<div class="page-number">
				<span class="xsmall">
					{activePage + 1}
					<span class="off">
						/ {numberOfPages}
					</span>
				</span>
			</div>
			<div class="justify-end">
				{#if activePage < numberOfPages - 1}
					<div on:click={() => (activePage += 1)} class="header-link">
						<Icon icon="tabler:arrow-right" />
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.balances-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		justify-content: space-between;
		flex: 1;

		h4 {
			font-size: var(--font-size-2);
			color: var(--clr-text-off);
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: var(--space-1);
		}

		.balance-wrapper {
			background-color: var(--clr-background-secondary);
			padding: var(--space-2) var(--space-4);
			border-radius: var(--radius-2);
			transition: 0.4s;

			&:hover {
				@include mq('medium') {
					cursor: pointer;
					filter: brightness(110%);

					.eye-icon {
						color: var(--clr-text-main);
					}
				}
			}

			.eye-icon {
				font-size: var(--font-size-1);
				color: var(--clr-text-off);
				transition: 0.4s;
				display: none;

				@include mq('medium') {
					display: block;

					&.selected {
						color: var(--clr-heading-main);
					}
				}
			}

			.select-wrapper {
				padding: var(--space-3) var(--space-5);
				border-radius: var(--radius-2);
				display: flex;
				flex-direction: column;
				gap: var(--space-3);
				transition: 0.6s;

				@include mq('medium') {
					&.selected {
						background-color: var(--clr-surface-secondary);
					}
				}
			}

			h4 {
				font-size: var(--font-size-2);
				color: var(--clr-text-off);

				@include mq('medium') {
					&.selected {
						color: var(--clr-text-main);
					}
				}
			}

			.logo {
				width: 19px;
				height: 19px;
				aspect-ratio: 1;
				border-radius: 50%;
			}
		}

		.pagination {
			display: grid;
			grid-template-columns: 1fr 3fr 1fr;
			padding-inline: var(--space-9);

			.off {
				color: var(--clr-text-off);
			}

			& > div {
				display: flex;
				flex-direction: row;
				align-items: center;
			}

			.page-number {
				display: flex;
				justify-content: center;
			}
		}
	}

	em {
		color: var(--clr-text-off);
	}
</style>
