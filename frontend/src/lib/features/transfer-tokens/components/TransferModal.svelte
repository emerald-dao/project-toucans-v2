<script lang="ts">
	import TransferTokensForm from './TransferTokensForm.svelte';
	import { Button, Currency, Modal, getModal } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { handleLogoImgError } from '$lib/utilities/handleLogoImgError';
	import { transferTokens } from '../actions/transferTokens';

	export let tokenSymbol: string;
	export let daoName: string;
	export let projectOwner: string | undefined;
	export let projectId: string | undefined;
	export let logoUrl: string;
	export let userBalance: number;

	let isFormValid: boolean;
	let recipient: string;
	let amount: number;
</script>

<Button color="neutral" size="x-small" on:click={() => getModal('transfer').open()}>
	Transfer
	<Icon icon="tabler:arrow-up-right" />
</Button>
<Modal id={'transfer'}>
	<div class="main-wrapper column-8">
		<h3>Transfer tokens</h3>
		<div class="available-tokens row-2 align-center">
			<div class="token-icon">
				<img src={logoUrl} on:error={(e) => handleLogoImgError(e)} alt="Coin Logo" class="logo" />
			</div>
			<div class="token-details">
				<p class="token-name">{daoName}</p>
				<Currency amount={userBalance} currency={tokenSymbol} />
			</div>
		</div>
		<TransferTokensForm
			availableBalance={userBalance}
			{projectOwner}
			{projectId}
			currencyToDistribute={tokenSymbol}
			bind:isValid={isFormValid}
			bind:amount
			bind:address={recipient}
		/>
		<div class="column align-end">
			<Button
				color="neutral"
				size="small"
				width="full-width"
				state={isFormValid ? 'active' : 'disabled'}
				on:click={() => transferTokens(recipient, amount, projectOwner, projectId, tokenSymbol)}
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
