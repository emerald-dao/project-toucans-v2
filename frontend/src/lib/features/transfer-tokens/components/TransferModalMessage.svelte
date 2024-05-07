<script lang="ts">
	import UserAvatar from '$components/atoms/user/UserAvatar.svelte';
	import { user } from '$stores/flow/FlowStore';
	import { Currency } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let recipient: string;
	export let amount: number;
	export let tokenSymbol: string;
	export let transactionState: 'success' | 'error';
</script>

<div class="column-5 align-center">
	<div class="column-2 align-center transaction-message">
		<div class={`state-icon ${transactionState}`}>
			{#if transactionState === 'error'}
				<Icon icon="tabler:x" width="20px" />
			{:else}
				<Icon icon="tabler:check" width="20px" />
			{/if}
		</div>
		{#if transactionState === 'error'}
			<p class="large center">Transfer failed</p>
			<p class="small center">Transaction failed. Please try again later.</p>
		{:else}
			<p class="large center">Transfer successful!</p>
			<p class="small center">Transaction submitted to the Flow Blockchain.</p>
		{/if}
	</div>
	<div class="column-3 receipt">
		<div>
			<UserAvatar address={recipient} />
		</div>
		<div class="column-1 received-wrapper">
			{#if transactionState === 'success'}
				<p class="xsmall">Received</p>
			{/if}
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

<style lang="scss">
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

		&.error {
			background-color: var(--clr-alert-main);
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
