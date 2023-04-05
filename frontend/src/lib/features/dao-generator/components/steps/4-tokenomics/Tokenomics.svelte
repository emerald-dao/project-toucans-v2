<script type="ts">
	import CurrencySelect from '$lib/components/atoms/CurrencySelect.svelte';
	import { fly } from 'svelte/transition';
	import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
	import StepButtons from '../../../components/atoms/StepButtons.svelte';
	import validationSuite from './validation';
	import { ECurrencies } from '$lib/types/common/enums';
	import CurrencyInput from '$components/atoms/CurrencyInput.svelte';

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = validationSuite($daoGeneratorData.tokenomics);
	};

	let res = validationSuite($daoGeneratorData.tokenomics);
</script>

<form in:fly={{ y: 30, duration: 400 }} class="column-2" autocomplete="off">
	<div class="payment-currency column-2">
		<label for="currencies">Payment currency</label>
		<CurrencySelect
			currencies={[ECurrencies.FLOW, ECurrencies.USDC]}
			bind:value={$daoGeneratorData.tokenomics.paymentCurrency}
		/>
	</div>
	<label
		for="max-supply"
		class="switch"
		class:margin-bottom={!$daoGeneratorData.tokenomics.hasMaxSupply}
	>
		Max supply
		<input
			type="checkbox"
			name="max-supply"
			id="max-supply"
			bind:checked={$daoGeneratorData.tokenomics.hasMaxSupply}
			on:change={handleChange}
		/>
		<span class="slider" />
	</label>
	{#if $daoGeneratorData.tokenomics.hasMaxSupply}
		<CurrencyInput
			name="maxSupply"
			currency={$daoGeneratorData.daoDetails.tokenName}
			errors={res.getErrors('maxSupply')}
			isValid={res.isValid('maxSupply')}
			autofocus
			on:input={(input) => handleChange(input.detail)}
			bind:value={$daoGeneratorData.tokenomics.maxSupply}
		/>
	{/if}
	<CurrencyInput
		name="initialSupply"
		label="Initial supply"
		currency={$daoGeneratorData.daoDetails.tokenName}
		errors={res.getErrors('initialSupply')}
		isValid={res.isValid('initialSupply')}
		on:input={(input) => handleChange(input.detail)}
		bind:value={$daoGeneratorData.tokenomics.initialSupply}
	/>
	<label for="mint-tokens" class="switch">
		Mint tokens
		<input
			type="checkbox"
			name="mint-tokens"
			id="mint-tokens"
			bind:checked={$daoGeneratorData.tokenomics.mintTokens}
			on:change={handleChange}
		/>
		<span class="slider" />
	</label>
	{#if $daoGeneratorData.tokenomics.mintTokens}
		<CurrencyInput
			name="maxMinting"
			label="Max minting"
			currency={$daoGeneratorData.daoDetails.tokenName}
			errors={res.getErrors('maxMinting')}
			isValid={res.isValid('maxMinting')}
			autofocus
			on:input={(input) => handleChange(input.detail)}
			bind:value={$daoGeneratorData.tokenomics.maxMinting}
		/>
	{/if}
	<StepButtons active={res.isValid()} />
</form>

<style lange="scss">
	.payment-currency {
		margin: var(--space-5) 0;
	}

	.margin-bottom {
		margin-bottom: var(--space-5);
	}
</style>
