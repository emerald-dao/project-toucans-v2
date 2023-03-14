<script type="ts">
	import { fly } from 'svelte/transition';
	import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
	import StepButtons from '../../../components/atoms/StepButtons.svelte';
	import { InputWrapper } from '@emerald-dao/component-library';
	import validationSuite from './validation';
	import { ECurrencies } from '$lib/types/common/enums';

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		if (target?.name) {
			res = validationSuite($daoGeneratorData.tokenomics, target.name);
		}
	};

	let res = validationSuite.get();
</script>

<form in:fly={{ y: 30, duration: 400 }} class="column-2">
	<InputWrapper
		name="editDelay"
		label="Edit delay"
		errors={res.getErrors('editDelay')}
		isValid={res.isValid('editDelay')}
		required={true}
	>
		<input
			name="editDelay"
			type="number"
			min="0"
			bind:value={$daoGeneratorData.tokenomics.editDelay}
			on:input={handleChange}
		/>
	</InputWrapper>
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
	<div class="payment-currency column-2">
		<label for="currencies">Payment currency</label>
		<div class="radio-tabs" id="currencies">
			<label>
				$FLOW
				<input
					type="radio"
					id="flow"
					name="currency"
					value={ECurrencies.FLOW}
					bind:group={$daoGeneratorData.tokenomics.paymentCurrency}
				/>
			</label>
			<label>
				$FUSD
				<input
					type="radio"
					id="fusd"
					name="currency"
					value={ECurrencies.FUSD}
					bind:group={$daoGeneratorData.tokenomics.paymentCurrency}
				/>
			</label>
		</div>
	</div>
	<StepButtons active={res.isValid()} />
</form>

<style lange="scss">
	.payment-currency {
		margin: var(--space-5) 0;
	}
</style>
