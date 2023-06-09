<script lang="ts">
	import { Currency } from '@emerald-dao/component-library';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const selectedVaultStore: Writable<number> = getContext('selectedVault');

	const handleSelectVault = (vaultId: number) => {
		selectedVaultStore.set(vaultId);
	};

	const BALANCES = [
		{
			token: 'EMD',
			amount: 300.0,
			value: 786.0,
			logo: '/ec-logo.png',
			name: 'Emerald City DAO'
		},
		{
			token: 'EMD',
			amount: 300.0,
			value: 786.0,
			logo: '/ec-logo.png',
			name: 'Emerald City DAO'
		},
		{
			token: 'EMD',
			amount: 300.0,
			value: 786.0,
			logo: '/ec-logo.png',
			name: 'Emerald City DAO'
		}
	];
</script>

<div class="column-10">
	<div class="balances-wrapper">
		{#each BALANCES as balance, i}
			<div class="balance-wrapper" on:click={() => handleSelectVault(i + 1)}>
				<div class="select-wrapper" class:selected={$selectedVaultStore === i + 1}>
					<div class="coin-name-wrapper row-2 align-center">
						<img src={balance.logo} alt="Emerald City Logo" class="logo" />
						<h4 class:selected={$selectedVaultStore === i + 1}>{balance.name}</h4>
					</div>
					<div class="row-2 align-end">
						<Currency
							amount={8955}
							currency={balance.token}
							color="heading"
							fontSize="var(--font-size-3)"
						/>
						<Currency amount={356} moneyPrefix={true} color="text" fontSize="var(--font-size-0)" />
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.balances-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);

		.balance-wrapper {
			background-color: var(--clr-background-secondary);
			padding: var(--space-2) var(--space-4);
			border-radius: var(--radius-2);
			transition: 0.4s;

			&:hover {
				cursor: pointer;
				filter: brightness(110%);
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
			}
		}
	}
</style>
