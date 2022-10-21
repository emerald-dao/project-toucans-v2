<script type="ts">
	import StepButtons from './atoms/StepButtons.svelte';
	import { Column } from '@mateoroldos/svelte.bones';
	import InputWrapper from '$lib/components/forms/InputWrapper.svelte';
	import { daoData } from '$stores/generator/DaoDataStore';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';
	import tokenomicsSuite from '$lib/validations/tokenomicsSuite';
	import { TokenTypes } from '$lib/types/token-types.enum';

	const handleChange = (input) => {
		res = tokenomicsSuite($daoData.tokenomics, input.target.name);
	};

	let res = tokenomicsSuite.get();
</script>

<form
	id={$generatorSteps[$generatorActiveStep].slug}
	on:submit|preventDefault={generatorActiveStep.increment}
	autocomplete="off"
>
	{#if $daoData.tokenomics.tokenType === TokenTypes.FINANCIAL}
		<InputWrapper name="targetAmount" label="Target amount" {res}>
			<input
				name="targetAmount"
				type="number"
				min="1"
				placeholder="e.g. 1.000.000"
				bind:value={$daoData.tokenomics.initialRound.targetAmount}
				on:input={handleChange}
			/>
		</InputWrapper>

		<InputWrapper name="issuanceRate" label="Issuance rate" {res}>
			<input
				name="issuanceRate"
				type="number"
				min="0"
				placeholder="e.g. 1 AlphaCoin - 1 FUSD"
				bind:value={$daoData.tokenomics.initialRound.issuanceRate}
				on:input={handleChange}
			/>
		</InputWrapper>

		<InputWrapper name="reserveRate" label="Reserve rate" icon="tabler:percentage" {res}>
			<input
				name="reserveRate"
				type="number"
				min="0"
				max="100"
				placeholder="20"
				bind:value={$daoData.tokenomics.initialRound.reserveRate}
				on:input={handleChange}
			/>
		</InputWrapper>
	{:else if $daoData.tokenomics.tokenType === TokenTypes.COMMUNITY}
		<InputWrapper name="supply" label="Total supply" {res}>
			<input
				type="number"
				name="supply"
				placeholder="e.g. 1.000.000"
				bind:value={$daoData.tokenomics.totalSupply}
				on:input={handleChange}
			/>
		</InputWrapper>
	{/if}
	<Column gap="small" align="flex-start">
		<label for="burn-tokens" class="switch">
			<input
				type="checkbox"
				name="burn-tokens"
				id="burn-tokens"
				placeholder="e.g. 1.000.000"
				bind:checked={$daoData.tokenomics.burnTokens}
			/>
			<span class="slider" />
			<span class="label">Burn tokens</span>
		</label>
		<label for="mint-tokens" class="switch">
			<input
				type="checkbox"
				name="mint-tokens"
				id="mint-tokens"
				placeholder="e.g. 1.000.000"
				bind:checked={$daoData.tokenomics.mintTokens}
			/>
			<span class="slider" />
			<span class="label">Mint tokens</span>
		</label>
	</Column>

	<StepButtons active={res.isValid()} />
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;
	}
</style>
