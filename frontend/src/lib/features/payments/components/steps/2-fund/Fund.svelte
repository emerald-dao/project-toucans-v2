<script type="ts">
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

	let amountInput: HTMLInputElement;
	let amountValue: string;

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		// Workaround to make input element be displayed with commas
		let numericString = amountValue.toString().replace(/[^0-9]/g, '');
		let number = Number(numericString);
		let formattedValue = Intl.NumberFormat('en-US').format(number);

		$paymentData.amount = number;
		amountInput.value = formattedValue;

		res = validationSuite($paymentData, target.name);
	};

	let res = validationSuite.get();

	onMount(() => {
		amountInput.focus();
	});

	$: isValid = res.isValid();
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
					type="text"
					name="amount"
					placeholder="0.00"
					bind:value={amountValue}
					bind:this={amountInput}
					on:input={handleChange}
				/>
			</div>
		</InputWrapper>
	</div>
	<SpecialMessage />
	{#if $paymentData.type === 'fund' && $paymentData.issuanceRate}
		<div class="funding-data-wrapper">
			<div class="row-2 align-center">
				<span class="small">Issuance rate:</span>
				<div class="surface">
					<Currency
						currency={$paymentData.tokenName}
						amount={$paymentData.issuanceRate}
						color="heading"
						fontSize="var(--font-size-1)"
					/>
				</div>
				<span class="small">minted per</span>
				<div class="surface">
					<Currency
						currency={$paymentData.currency}
						amount={1}
						color="heading"
						fontSize="var(--font-size-1)"
					/>
				</div>
				<span class="small">funded</span>
			</div>
			<div class:receipts-grid={$paymentData.reserveRate > 0}>
				<div class="issuance-secondary-wrapper">
					<span class="small">You will receive</span>
					<Currency
						currency={$paymentData.tokenName}
						amount={($paymentData.amount ? $paymentData.amount : 0) *
							$paymentData.issuanceRate *
							(1 - $paymentData.reserveRate)}
						color="heading"
					/>
					<span class="issuance xsmall"
						>{`${100 - $paymentData.reserveRate * 100}% of the minted tokens`}</span
					>
				</div>
				{#if $paymentData.reserveRate > 0}
					<div class="issuance-secondary-wrapper">
						<span class="small">DAO treasury will receive</span>
						<Currency
							currency={$paymentData.tokenName}
							amount={($paymentData.amount ? $paymentData.amount : 0) *
								$paymentData.issuanceRate *
								$paymentData.reserveRate}
							color="heading"
						/>
						<span class="issuance xsmall"
							>{`${$paymentData.reserveRate * 100}% of the minted tokens`}</span
						>
					</div>
				{/if}
			</div>
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

		.funding-data-wrapper {
			margin-top: var(--space-8);

			.surface {
				background-color: var(--clr-surface-secondary);
				padding: 2px var(--space-2);
				border-radius: var(--radius-1);
			}

			.issuance-secondary-wrapper {
				background-color: var(--clr-surface-primary);
				padding: var(--space-4);
				border-radius: var(--radius-3);
				margin-top: var(--space-4);

				.issuance {
					color: var(--clr-text-off);
				}
			}

			.receipts-grid {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: var(--space-4);
			}
		}
	}
</style>
