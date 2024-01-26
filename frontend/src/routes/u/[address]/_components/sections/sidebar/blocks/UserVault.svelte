<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { Vault } from '../../../../_types/user-data.interface';
	import { getContext } from 'svelte';
	import { handleLogoImgError } from '$lib/utilities/handleLogoImgError';
	import { Currency } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let vault: Vault;
	export let vaultsPerPage: number;
	export let activePage: number;
	export let i: number;
	const selectedVaultStore: Writable<number | null> = getContext('selectedVault');

	const handleSelectVault = (vaultId: number) => {
		selectedVaultStore.set(vaultId + vaultsPerPage * activePage);
	};
</script>

<div class="balance-wrapper" on:click={() => handleSelectVault(i)}>
	<div
		class="select-wrapper"
		class:selected={$selectedVaultStore === i + vaultsPerPage * activePage}
	>
		<div class="row-space-between">
			<div class="coin-name-wrapper row-2 align-center">
				<img
					src={vault.daoData.logoUrl}
					on:error={(e) => handleLogoImgError(e)}
					alt={`${vault.daoData.name} logo`}
					class="logo"
				/>
				<h4 class:selected={$selectedVaultStore === i + vaultsPerPage * activePage}>
					{vault.daoData.name}
				</h4>
			</div>
			<div class="eye-icon" class:selected={$selectedVaultStore === i + vaultsPerPage * activePage}>
				<Icon icon="tabler:eye" />
			</div>
		</div>
		<div class="row-2 align-end">
			<Currency
				amount={vault.balance}
				currency={vault.daoData.tokenSymbol}
				color="heading"
				fontSize="var(--font-size-3)"
				decimalNumbers={4}
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

<style lang="scss">
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
</style>
