<script type="ts">
	import { Currency, InputWrapper } from '@emerald-dao/component-library';
	import { paymentActiveStep } from '$lib/features/payments/stores/PaymentSteps';
	import { fade } from 'svelte/transition';
	import { paymentData } from '$lib/features/payments/stores/PaymentData';
	import CurrencySelect from '$components/atoms/CurrencySelect.svelte';
	import { ECurrencies } from '$lib/types/common/enums';
	import CurrencyInput from '$components/atoms/CurrencyInput.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let isValid = false;
	export let daoData: DAOProject;

	let currency = ECurrencies.FLOW;
	let amount = 0;
	let stFlowPrice = 0.95;

	// const handleChange = (input: Event) => {
	// 	const target = input.target as HTMLInputElement;

	// 	res = validationSuite($paymentData, target.name);

	// 	isValid = res.isValid();
	// };

	// let res = validationSuite.get();
</script>

<form
	id="fund-form"
	on:submit|preventDefault={paymentActiveStep.increment}
	autocomplete="off"
	in:fade={{ duration: 200 }}
>
	<div class="introduction">
		<h5>Create Staking Action</h5>
		{#if currency === ECurrencies.FLOW}
			<span class="small">Stake your $FLOW by swapping to $stFlow.</span>
		{:else if currency === ECurrencies.stFlow}
			<span class="small">Unstake by swapping your $stFlow for $FLOW.</span>
		{/if}
	</div>
	<div>
		<CurrencySelect currencies={[ECurrencies.FLOW, ECurrencies.stFlow]} bind:value={currency} />
	</div>
	{#if daoData.onChainData.treasuryBalances[currency] != undefined}
		<div class="row-2 align-center">
			<span class="small">Available balance:</span>
			<Currency
				amount={Number(daoData.onChainData.treasuryBalances[currency])}
				{currency}
				color="heading"
			/>
		</div>
	{/if}
	{#if daoData.onChainData.treasuryBalances[currency] != undefined && Number(daoData.onChainData.treasuryBalances[currency]) > 0}
		<CurrencyInput
			autofocus
			{currency}
			isValid={true}
			fontSize="var(--font-size-7)"
			hasBorder={false}
			bind:value={amount}
		/>
		<div>
			<div class="row-2 align-center">
				<span class="small">Price:</span>
				<div class="surface">
					<Currency
						currency={ECurrencies.FLOW}
						amount={1}
						color="heading"
						fontSize="var(--font-size-1)"
						decimalNumbers={2}
					/>
				</div>
				<span class="small">≈</span>
				<div class="surface">
					<Currency
						currency={ECurrencies.stFlow}
						amount={stFlowPrice}
						color="heading"
						fontSize="var(--font-size-1)"
						decimalNumbers={2}
					/>
				</div>
			</div>
			<div>
				<div class="issuance-secondary-wrapper">
					<span class="small">You will receive</span>
					<Currency
						currency={ECurrencies.stFlow}
						amount={amount * stFlowPrice}
						color="heading"
						decimalNumbers={2}
					/>
				</div>
			</div>
		</div>
	{:else}
		<div class="row-2 align-center">
			<span class="small no-tokens-message"
				><em>No tokens available to {currency === ECurrencies.FLOW ? 'stake' : 'unstake'}.</em
				></span
			>
		</div>
	{/if}
</form>

<style type="scss">
	form {
		width: 50%;
		margin-bottom: var(--space-9);
		display: flex;
		flex-direction: column;
		gap: var(--space-8);

		.introduction {
			h5 {
				margin-bottom: var(--space-2);
				margin-top: 0;
			}
		}

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
	}
</style>
