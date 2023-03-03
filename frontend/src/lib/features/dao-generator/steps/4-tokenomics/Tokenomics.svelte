<script type="ts">
	import { fly } from 'svelte/transition';
	import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
	import { StepButtons } from '../../components';
	import { InputWrapper } from '@emerald-dao/component-library';
	import validationSuite from './validation';

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		if (target?.name) {
			res = validationSuite($daoGeneratorData.tokenomics, target.name);
		}
	};

	let res = validationSuite.get();
</script>

<form in:fly={{ y: 30, duration: 400 }}>
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
		<input
			type="checkbox"
			name="mint-tokens"
			id="mint-tokens"
			bind:checked={$daoGeneratorData.tokenomics.mintTokens}
			on:change={handleChange}
		/>
		<span class="slider" />
		Mint tokens
	</label>
	<StepButtons active={res.isValid()} />
</form>
