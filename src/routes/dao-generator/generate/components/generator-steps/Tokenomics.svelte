<script type="ts">
	import StepButtons from './atoms/StepButtons.svelte';
	import { InputWrapper, Range } from '@emerald-dao/component-library';
	import { daoData } from '$stores/generator/DaoDataStore';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';
	import tokenomicsSuite from '$lib/validations/tokenomicsSuite';
	import { TokenTypes } from '$lib/types/token-types.enum';

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;
		res = tokenomicsSuite($daoData.tokenomics, target.name);
	};

	let res = tokenomicsSuite.get();
</script>

<form
	id={$generatorSteps[$generatorActiveStep].slug}
	on:submit|preventDefault={generatorActiveStep.increment}
	autocomplete="off"
>
	{#if $daoData.tokenomics.tokenType === TokenTypes.FINANCIAL}
		<InputWrapper
			name="targetAmount"
			label="Target amount"
			errors={res.getErrors('targetAmount')}
			isValid={res.isValid('targetAmount')}
		>
			<input
				name="targetAmount"
				type="number"
				min="1"
				placeholder="e.g. 1.000.000"
				bind:value={$daoData.tokenomics.initialRound.targetAmount}
				on:input={handleChange}
			/>
		</InputWrapper>

		<InputWrapper
			name="issuanceRate"
			label="Issuance rate"
			errors={res.getErrors('issuanceRate')}
			isValid={res.isValid('issuanceRate')}
		>
			<input
				name="issuanceRate"
				type="number"
				min="0"
				placeholder="e.g. 1 AlphaCoin - 1 FUSD"
				bind:value={$daoData.tokenomics.initialRound.issuanceRate}
				on:input={handleChange}
			/>
		</InputWrapper>

		<div class="range-wrapper">
			<label for="reserveRate">Reserve rate</label>
			<Range
				bind:value={$daoData.tokenomics.initialRound.reserveRate}
				suffix="%"
				id="reserveRate"
				on:change={handleChange}
			/>
		</div>
	{:else if $daoData.tokenomics.tokenType === TokenTypes.COMMUNITY}
		<InputWrapper
			name="supply"
			label="Total supply"
			errors={res.getErrors('supply')}
			isValid={res.isValid('supply')}
		>
			<input
				type="number"
				name="supply"
				placeholder="e.g. 1.000.000"
				bind:value={$daoData.tokenomics.totalSupply}
				on:input={handleChange}
			/>
		</InputWrapper>
	{/if}
	<div class="column-1 align-start">
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
	</div>

	<StepButtons active={res.isValidByGroup($daoData.tokenomics.tokenType)} />
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;

		.range-wrapper {
			margin-bottom: var(--space-7);
		}
	}
</style>
