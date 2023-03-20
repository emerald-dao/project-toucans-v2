<script type="ts">
	import { paymentSteps } from './../../../stores/PaymentSteps';
	import { Currency, InputWrapper } from '@emerald-dao/component-library';
	import { paymentActiveStep } from '$lib/features/payments/stores/PaymentSteps';
	import validationSuite from './validation';
	import { fade } from 'svelte/transition';
	import { paymentData } from '$lib/features/payments/stores/PaymentData';
	import { onMount } from 'svelte';
	import SpecialMessage from '../../atoms/SpecialMessage.svelte';
	import CurrencySelect from '$components/atoms/CurrencySelect.svelte';
	import { ECurrencies } from '$lib/types/common/enums';

	export let isValid: boolean;

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = validationSuite($paymentData, target.name);
	};

	let res = validationSuite.get();

	$: isValid = res.isValid();

	let amountInput: HTMLInputElement;

	onMount(() => {
		amountInput.focus();
	});
</script>

<form
	id="fund-form"
	on:submit|preventDefault={paymentActiveStep.increment}
	autocomplete="off"
	in:fade={{ duration: 200 }}
>
	{#if $paymentData.type === 'donation'}
		<div class="currency-select-wrapper">
			<CurrencySelect
				currencies={[ECurrencies.FLOW, ECurrencies.FUSD]}
				bind:value={$paymentData.currency}
			/>
		</div>
	{/if}
	<div>
		<InputWrapper name="amount" isValid={res.isValid('amount')}>
			<div class="row align-center">
				<span class="currency-prefix large">
					{`$${$paymentData.currency}`}
				</span>
				<input
					type="number"
					name="amount"
					placeholder="0.00"
					bind:value={$paymentData.amount}
					bind:this={amountInput}
					on:input={handleChange}
				/>
			</div>
		</InputWrapper>
	</div>
	<SpecialMessage />
	{#if $paymentData.type === 'fund' && $paymentData.issuanceRate}
		<div class="issuance-wrapper">
			<span class="small">You will recieve</span>
			<Currency
				currency={$paymentData.tokenName}
				amount={($paymentData.amount ? $paymentData.amount : 0) * $paymentData.issuanceRate}
				color="heading"
			/>
			<span class="issuance xsmall"
				>{`$${$paymentData.issuanceRate} ${$paymentData.tokenName} ~ $1 ${$paymentData.currency}`}</span
			>
		</div>
	{/if}
</form>

<style type="scss">
	form {
		width: 100%;
		margin-bottom: var(--space-9);

		.currency-select-wrapper {
			margin-bottom: var(--space-4);
		}

		.currency-prefix {
			color: var(--clr-text-off);
		}

		input[name='amount'] {
			border: none;
			font-size: var(--font-size-7);
			color: var(--clr-heading-main);
			padding-block: 0;
		}

		.issuance-wrapper {
			background-color: var(--clr-surface-primary);
			padding: var(--space-4);
			border-radius: var(--radius-3);
			margin-top: var(--space-4);

			.issuance {
				color: var(--clr-text-off);
			}
		}
	}
</style>
