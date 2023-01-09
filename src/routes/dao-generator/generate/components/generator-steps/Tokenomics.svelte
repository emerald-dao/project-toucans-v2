<script type="ts">
	import StepButtons from './atoms/StepButtons.svelte';
	import { InputWrapper, Range, TooltipIcon } from '@emerald-dao/component-library';
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
			tooltip="Lorem ipsum helper text"
		>
			<input
				name="targetAmount"
				type="text"
				min="1"
				placeholder="e.g. 1.000.000"
				bind:value={$daoData.tokenomics.targetAmount}
				on:input={handleChange}
			/>
		</InputWrapper>

		<div class="range-wrapper">
			<div class="row-2">
				<label for="reserveRate">Reserve rate </label>
				<TooltipIcon tooltip="Lorem ipsum helper text" width={0.75} />
			</div>
			<Range
				bind:value={$daoData.tokenomics.initialRound.reserveRate}
				suffix="%"
				id="reserveRate"
				on:change={handleChange}
			/>
		</div>

		<InputWrapper
			name="issuanceRate"
			label="Issuance rate"
			errors={res.getErrors('issuanceRate')}
			isValid={res.isValid('issuanceRate')}
			tooltip="Lorem ipsum helper text"
		>
			<input
				name="issuanceRate"
				type="text"
				min="0"
				placeholder={`e.g. 1 ${$daoData.daoDetails.tokenName} - 1 ${$daoData.tokenomics.initialRound.token}`}
				bind:value={$daoData.tokenomics.initialRound.issuanceRate}
				on:input={handleChange}
			/>
		</InputWrapper>
	{:else if $daoData.tokenomics.tokenType === TokenTypes.COMMUNITY}
		<InputWrapper
			name="supply"
			label="Total supply"
			errors={res.getErrors('supply')}
			isValid={res.isValid('supply')}
			tooltip="Lorem ipsum helper text"
		>
			<input
				type="text"
				name="supply"
				placeholder="e.g. 1.000.000"
				bind:value={$daoData.tokenomics.totalSupply}
				on:input={handleChange}
			/>
		</InputWrapper>
	{/if}
	<div class="column-1 align-start">
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
			<TooltipIcon tooltip="Lorem ipsum helper text" width={0.75} />
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
