<script lang="ts">
	import TransferTokensForm from './TransferTokensForm.svelte';
	import { Button, Currency, Modal, getModal } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import type { Vault } from '../../../_types/user-data.interface';
	import { handleLogoImgError } from '$lib/utilities/handleLogoImgError';
	import { transferTokens } from './transferTokens';

	export let vault: Vault;

	let isFormValid: boolean;
	let recipient: string;
	let amount: number;
</script>

<Button color="neutral" size="x-small" on:click={() => getModal('transfer').open()} type="ghost">
	Transfer
	<Icon icon="tabler:arrow-up-right" />
</Button>
<Modal id={'transfer'}>
	<div class="main-wrapper column-8">
		<h3>Transfer tokens</h3>
		<div class="available-tokens row-2 align-center">
			<div class="token-icon">
				<img
					src={vault.daoData.logoUrl}
					on:error={(e) => handleLogoImgError(e)}
					alt="Coin Logo"
					class="logo"
				/>
			</div>
			<div class="token-details">
				<p class="token-name">{vault.daoData.name}</p>
				<Currency amount={vault.balance} currency={vault.daoData.tokenSymbol} />
			</div>
		</div>
		<TransferTokensForm
			availableBalance={vault.balance}
			projectOwner={vault.daoData.owner}
			projectId={vault.daoData.projectId}
			currencyToDistribute={vault.daoData.tokenSymbol}
			bind:isValid={isFormValid}
			bind:amount
			bind:address={recipient}
		/>
		<div class="column align-end">
			<Button
				color="primary"
				size="small"
				state={isFormValid ? 'active' : 'disabled'}
				on:click={() =>
					transferTokens(
						recipient,
						amount,
						vault.daoData.owner,
						vault.daoData.projectId,
						vault.daoData.tokenSymbol
					)}
			>
				Transfer
				<Icon icon="tabler:arrow-up-right" />
			</Button>
		</div>
	</div>
</Modal>

<style lang="scss">
	.main-wrapper {
		width: 300px;

		h3 {
			font-size: var(--font-size-5);
			text-align: center;
		}

		.available-tokens {
			border: 1px solid var(--clr-border-primary);
			border-radius: var(--radius-2);
			padding: var(--space-2);
			background-color: var(--clr-surface-primary);

			.token-icon {
				width: 40px;
				height: 40px;

				img {
					border-radius: 50%;
				}
			}

			.token-name {
				color: var(--clr-heading-main);
			}
		}
	}
</style>
