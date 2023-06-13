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
		selectedVaultStore.set(vaultId);
	};
</script>

{#if userData.vaults.length > 0}
	<div class="column-10">
		<div class="balances-wrapper">
			<DashboardHeading icon="tabler:writing-sign">Vaults</DashboardHeading>
			{#each userData.vaults as vault, i}
				<div class="balance-wrapper" on:click={() => handleSelectVault(i + 1)}>
					<div class="select-wrapper" class:selected={$selectedVaultStore === i + 1}>
						<div class="row-space-between">
							<div class="coin-name-wrapper row-2 align-center">
								<img src={vault.daoData.logoUrl} alt={`${vault.daoData.name} logo`} class="logo" />
								<h4 class:selected={$selectedVaultStore === i + 1}>{vault.daoData.name}</h4>
							</div>
							<div class="eye-icon" class:selected={$selectedVaultStore === i + 1}>
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
								amount={vault.balance / vault.tokenValue}
								moneyPrefix={true}
								color="text"
								fontSize="var(--font-size-0)"
							/>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style lang="scss">
	.balances-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);

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
				cursor: pointer;
				filter: brightness(110%);

				.eye-icon {
					color: var(--clr-text-main);
				}
			}

			.eye-icon {
				font-size: var(--font-size-1);
				color: var(--clr-text-off);
				transition: 0.4s;

				&.selected {
					color: var(--clr-heading-main);
				}
			}

			.select-wrapper {
				padding: var(--space-3) var(--space-5);
				border-radius: var(--radius-2);
				display: flex;
				flex-direction: column;
				gap: var(--space-3);
				transition: 0.6s;

				&.selected {
					background-color: var(--clr-surface-secondary);
				}
			}

			h4 {
				font-size: var(--font-size-2);
				color: var(--clr-text-off);

				&.selected {
					color: var(--clr-text-main);
				}
			}

			.logo {
				width: 19px;
				height: 19px;
				aspect-ratio: 1;
				border-radius: 50%;
			}
		}
	}
</style>
