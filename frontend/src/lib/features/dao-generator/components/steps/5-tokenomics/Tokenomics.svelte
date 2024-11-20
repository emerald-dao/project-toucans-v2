<script type="ts">
	import CurrencySelect from '$lib/components/atoms/CurrencySelect.svelte';
	import { fly } from 'svelte/transition';
	import StepButtons from '../../../components/atoms/StepButtons.svelte';
	import validationSuite from './validation';
	import { ECurrencies } from '$lib/types/common/enums';
	import CurrencyInput from '$components/atoms/CurrencyInput.svelte';
	import { TooltipIcon } from '@emerald-dao/component-library';
	import GLOSSARY from '$lib/config/glossary';
	import type { daoAndTokenGeneratorData } from '$lib/features/dao-generator/stores/DaoAndTokenGeneratorData';
	import { getContext } from 'svelte';

	const daoGeneratorData: typeof daoAndTokenGeneratorData = getContext('daoGeneratorData');

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = validationSuite($daoGeneratorData.tokenomics);
	};

	let res = validationSuite($daoGeneratorData.tokenomics);
</script>

<form in:fly={{ y: 30, duration: 400 }} class="column-2" autocomplete="off">
	<!-- <div class="payment-currency column-2">
		<div class="row-2 align-center">
			<label for="currencies">Payment Currency</label>
			<TooltipIcon tooltip={GLOSSARY.paymentCurrency} width={0.75} />
		</div>
		<CurrencySelect
			currencies={[ECurrencies.FLOW, ECurrencies.USDC]}
			bind:value={$daoGeneratorData.tokenomics.paymentCurrency}
		/>
	</div> -->
	<label
		for="max-supply"
		class="switch"
		class:margin-bottom={!$daoGeneratorData.tokenomics.hasMaxSupply}
	>
		Max Supply
		<TooltipIcon tooltip={GLOSSARY.maxSupply} width={0.75} />
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
		label="Initial Supply"
		currency={$daoGeneratorData.daoDetails.tokenName}
		errors={res.getErrors('initialSupply')}
		isValid={res.isValid('initialSupply')}
		tooltip={GLOSSARY.initialSupply}
		on:input={(input) => handleChange(input.detail)}
		bind:value={$daoGeneratorData.tokenomics.initialSupply}
	/>
	<!-- <label for="mint-tokens" class="switch">
		Mint tokens
		<TooltipIcon tooltip={GLOSSARY.minting} width={0.75} />

		<input
			type="checkbox"
			name="mint-tokens"
			id="mint-tokens"
			bind:checked={$daoGeneratorData.tokenomics.mintTokens}
			on:change={handleChange}
		/>
		<span class="slider" />
	</label> -->
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
