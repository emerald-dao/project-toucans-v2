<script type="ts">
	import { Currency, InputWrapper } from '@emerald-dao/component-library';
	import { paymentActiveStep } from '$lib/features/payments/stores/PaymentSteps';
	import validationSuite from './validation';
	import { fade } from 'svelte/transition';
	import { paymentData } from '$lib/features/payments/stores/PaymentData';
	import SpecialMessage from '../../atoms/SpecialMessage.svelte';
	import CurrencySelect from '$components/atoms/CurrencySelect.svelte';
	import { ECurrencies } from '$lib/types/common/enums';
	import CurrencyInput from '$components/atoms/CurrencyInput.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import FeeWarning from '../../atoms/FeeWarning.svelte';

	export let isValid = false;
	export let daoData: DAOProject;

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = validationSuite($paymentData, target.name);

		isValid = res.isValid();
	};

	let res = validationSuite.get();
</script>

<form
	id="fund-form"
	on:submit|preventDefault={paymentActiveStep.increment}
	autocomplete="off"
	in:fade={{ duration: 200 }}
>
	{#if $paymentData.type === 'donation'}
		<div class="currency-select-wrapper">
			{#if daoData.hasToken}
				<CurrencySelect
					currencies={[ECurrencies.FLOW, ECurrencies.USDC, daoData.generalInfo.token_symbol]}
					bind:value={$paymentData.currency}
				/>
			{:else}
				<CurrencySelect
					currencies={[ECurrencies.FLOW, ECurrencies.USDC]}
					bind:value={$paymentData.currency}
				/>
			{/if}
		</div>
	{/if}
	{#if $paymentData.type === 'fund'}
		<FeeWarning paymentCurrency={$paymentData.currency} />
	{/if}
	<CurrencyInput
		autofocus
		currency={$paymentData.currency}
		errors={res.getErrors('amount')}
		isValid={res.isValid('amount')}
		fontSize="var(--font-size-7)"
		hasBorder={false}
		on:input={(input) => handleChange(input.detail)}
		bind:value={$paymentData.amount}
	/>
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
						decimalNumbers={2}
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
						amount={$paymentData.amount *
							0.95 *
							$paymentData.issuanceRate *
							(1 - $paymentData.reserveRate)}
						color="heading"
						decimalNumbers={2}
					/>
					<span class="issuance xsmall"
						>{`${100 - $paymentData.reserveRate * 100}% of the minted tokens after tax`}</span
					>
				</div>
				{#if $paymentData.reserveRate > 0}
					<div class="issuance-secondary-wrapper">
						<span class="small">DAO treasury will receive</span>
						<Currency
							currency={$paymentData.tokenName}
							amount={$paymentData.amount *
								0.95 *
								$paymentData.issuanceRate *
								$paymentData.reserveRate}
							color="heading"
							decimalNumbers={2}
						/>
						<span class="issuance xsmall"
							>{`${$paymentData.reserveRate * 100}% of the minted tokens after tax`}</span
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
