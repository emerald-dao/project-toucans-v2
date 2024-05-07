<script lang="ts">
	import TransferTokensForm from './TransferTokensForm.svelte';
	import { Button, Currency, Modal, getModal } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { handleLogoImgError } from '$lib/utilities/handleLogoImgError';
	import { transferTokens } from '../actions/transferTokens';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import transferValidation from '../validation/transferValidation';
	import TransferModalMessage from './TransferModalMessage.svelte';

	export let tokenSymbol: string;
	export let daoName: string;
	export let contractAddress: string | null;
	export let projectId: string | undefined;
	export let logoUrl: string;
	export let userBalance: number;

	let isFormValid: boolean;
	let recipient: string;
	let amount: number;

	const dispatch = createEventDispatcher();

	let transactionState: 'success' | 'error' | null = null;

	const handleOpenModal = () => {
		recipient = '';
		amount = 0;
		transactionState = null;
		transferValidation.reset();

		getModal('transfer').open();
	};

	const handleTransferTokens = async () => {
		if (isFormValid) {
			const transactionResult = await transferTokens(
				recipient,
				amount,
				contractAddress,
				projectId,
				tokenSymbol
			);

			transactionState = transactionResult.state;

			if (transactionState === 'success') {
				dispatch('transferSuccess');

				if ($page.url.pathname.startsWith('/u/')) {
					invalidate('app:userprofile');
				}
			}
		}
	};
</script>

<Button color="neutral" size="x-small" on:click={handleOpenModal}>
	Transfer
	<Icon icon="tabler:arrow-up-right" />
</Button>
<Modal id={'transfer'}>
	{#if transactionState === null}
		<div class="main-wrapper column-8">
			<h3>Transfer tokens</h3>
			<div class="available-tokens row-2 align-center">
				<div class="token-icon">
					<img src={logoUrl} on:error={(e) => handleLogoImgError(e)} alt="Coin Logo" class="logo" />
				</div>
				<div class="token-details">
					<p class="token-name">{daoName}</p>
					<Currency amount={userBalance} currency={tokenSymbol} fontSize="var(--font-size-2)" />
				</div>
			</div>
			<TransferTokensForm
				availableBalance={userBalance}
				{contractAddress}
				{projectId}
				currencyToDistribute={tokenSymbol}
				bind:isValid={isFormValid}
				bind:amount
				bind:address={recipient}
			/>
			<div class="column align-end">
				<Button
					color="neutral"
					width="full-width"
					state={isFormValid ? 'active' : 'disabled'}
					on:click={handleTransferTokens}
				>
					Transfer
					<Icon icon="tabler:arrow-up-right" />
				</Button>
			</div>
		</div>
	{:else if transactionState === 'success' || transactionState === 'error'}
		<TransferModalMessage {recipient} {amount} {tokenSymbol} {transactionState} />
	{/if}
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
			padding: var(--space-4);
			background-color: var(--clr-surface-primary);

			.token-icon {
				width: 45px;
				height: 45px;

				img {
					border-radius: var(--radius-2);
				}
			}

			.token-name {
				font-size: var(--font-size-2);
				color: var(--clr-heading-main);
				margin-bottom: -2px;
			}
		}
	}
</style>
