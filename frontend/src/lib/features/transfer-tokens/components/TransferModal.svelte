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
	import UserAvatar from '$components/atoms/user/UserAvatar.svelte';
	import { user } from '$stores/flow/FlowStore';

	export let tokenSymbol: string;
	export let daoName: string;
	export let projectOwner: string | undefined;
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
				projectOwner,
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
					on:click={handleTransferTokens}
				>
					Transfer
					<Icon icon="tabler:arrow-up-right" />
				</Button>
			</div>
		</div>
	{:else if transactionState === 'success'}
		<div class="column-5 align-center">
			<div class="column-2 align-center transaction-message">
				<div class="state-icon success">
					<Icon icon="tabler:check" width="20px" />
				</div>
				<p class="large center">Transfer successful!</p>
				<p class="small center">Transaction submitted to the Flow Blockchain.</p>
			</div>
			<div class="column-3 receipt">
				<div>
					<UserAvatar address={recipient} />
				</div>
				<div class="column-1 received-wrapper">
					<p class="xsmall">Received</p>
					<Currency {amount} currency={tokenSymbol} fontSize="var(--font-size-4)" color="heading" />
				</div>
				{#if $user.addr}
					<div class="column-1">
						<p class="xsmall">From</p>
						<UserAvatar address={$user.addr} />
					</div>
				{/if}
			</div>
		</div>
	{:else if transactionState === 'error'}
		<p>Transaction failed. Please try again.</p>
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
			padding: var(--space-3);
			background-color: var(--clr-surface-primary);

			.token-icon {
				width: 40px;
				height: 40px;

				img {
					border-radius: 50%;
				}
			}

			.token-name {
				font-size: var(--font-size-2);
				color: var(--clr-heading-main);
				margin-bottom: -2px;
			}
		}
	}

	.transaction-message {
		p {
			text-align: center;

			&:first-of-type {
				color: var(--clr-heading-main);
			}
		}
	}

	.state-icon {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;

		&.success {
			background-color: var(--clr-primary-main);
			color: var(--clr-heading-inverse);
		}
	}

	.receipt {
		background-color: var(--clr-surface-primary);
		border-radius: var(--radius-2);
		padding-block: var(--space-5);
		border: 1px solid var(--clr-border-primary);
		width: 100%;

		div {
			padding-inline: var(--space-5);
		}

		.received-wrapper {
			border-block: 1px dashed var(--clr-border-primary);
			padding-block: var(--space-4);
		}
	}
</style>
