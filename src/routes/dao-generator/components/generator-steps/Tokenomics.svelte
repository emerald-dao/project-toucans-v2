<script type="ts">
	import Icon from '@iconify/svelte';
	import { TokenTypes } from '$lib/types/token-types.enum';
	import { createForm } from 'felte';
	import { daoData } from '$stores/generator/DaoDataStore';
	import { validator } from '@felte/validator-yup';
	import * as yup from 'yup';
	import { reporter, ValidationMessage } from '@felte/reporter-svelte';
	import FormErrors from '$components/forms/FormErrors.svelte';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';

	const schema =
		$daoData.tokenomics.tokenType === TokenTypes.COMMUNITY
			? yup.object({
					supply: yup.number().min(1).required()
			  })
			: yup.object({
					targetAmount: yup.number().min(1).required(),
					issuanceRate: yup.number().min(1).required(),
					reserveRate: yup.number().min(0).max(100).required()
			  });
	const { form, touched, errors } = createForm({
		extend: [validator({ schema }), reporter],
		onSubmit() {
			generatorActiveStep.increment();
		}
	});
</script>

<form use:form id={$generatorSteps[$generatorActiveStep].slug}>
	{#if $daoData.tokenomics.tokenType === TokenTypes.FINANCIAL}
		<label for="targetAmount">Target Amount</label>
		<input
			type="number"
			min="1"
			name="targetAmount"
			placeholder="e.g. 1.000.000"
			class:validated={$touched.targetAmount && $errors.targetAmount === null}
			class:error={$touched.targetAmount && $errors.targetAmount != null}
			bind:value={$daoData.tokenomics.initialRound.targetAmount}
		/>
		<ValidationMessage for="targetAmount" let:messages={message}>
			<FormErrors {message} />
		</ValidationMessage>

		<label for="issuance-rate">Issuance Rate</label>
		<input
			type="number"
			min="0"
			name="issuanceRate"
			placeholder="e.g. 1 AlphaCoin - 1 FUSD"
			class:validated={$touched.issuanceRate && $errors.issuanceRate === null}
			class:error={$touched.issuanceRate && $errors.issuanceRate != null}
			bind:value={$daoData.tokenomics.initialRound.issuanceRate}
		/>
		<ValidationMessage for="issuanceRate" let:messages={message}>
			<FormErrors {message} />
		</ValidationMessage>

		<label for="reserveRate">Reserve Rate</label>
		<div class="input-icon-left">
			<div class="icon">
				<Icon icon="tabler:percentage" />
			</div>
			<input
				type="number"
				min="0"
				max="100"
				name="reserveRate"
				placeholder="20"
				class:validated={$touched.reserveRate && $errors.reserveRate === null}
				class:error={$touched.reserveRate && $errors.reserveRate != null}
				bind:value={$daoData.tokenomics.initialRound.reserveRate}
			/>
		</div>
		<ValidationMessage for="reserveRate" let:messages={message}>
			<FormErrors {message} />
		</ValidationMessage>
	{:else if $daoData.tokenomics.tokenType === TokenTypes.COMMUNITY}
		<label for="supply">Total Supply</label>
		<input
			type="number"
			name="supply"
			placeholder="e.g. 1.000.000"
			class:validated={$touched.supply && $errors.supply === null}
			class:error={$touched.supply && $errors.supply != null}
			bind:value={$daoData.tokenomics.totalSupply}
		/>
		<ValidationMessage for="supply" let:messages={message}>
			<FormErrors {message} />
		</ValidationMessage>
	{/if}
	<label for="burn-tokens">
		<input
			type="checkbox"
			name="burn-tokens"
			id="burn-tokens"
			placeholder="e.g. 1.000.000"
			bind:checked={$daoData.tokenomics.burnTokens}
		/>
		Burn tokens
	</label>
	<label for="mint-tokens">
		<input
			type="checkbox"
			name="mint-tokens"
			id="mint-tokens"
			placeholder="e.g. 1.000.000"
			bind:checked={$daoData.tokenomics.mintTokens}
		/>
		Mint tokens
	</label>
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;

		input {
			margin-bottom: 0.1em;
		}
	}
</style>
