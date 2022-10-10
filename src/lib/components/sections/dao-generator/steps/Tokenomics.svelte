<script type="ts">
	import { TokenTypes } from '$lib/types/token-types.enum';
	import { createForm } from 'felte';
	import { daoData } from '$stores/generator/DaoDataStore';

	let daoDetails = $daoData.daoDetails;
	const { form } = createForm({
		onSubmit: (values) => {
			// ...
		}
	});
</script>

<form use:form>
	{#if $daoData.tokenomics.tokenType === TokenTypes.FINANCIAL}
		<label for="target-amount">Target Amount</label>
		<input
			type="number"
			min="0"
			name="target-amount"
			placeholder="e.g. 1.000.000"
			bind:value={$daoData.tokenomics.initialRound.targetAmount}
		/>
		<label for="issuance-rate">Target Amount</label>
		<input
			type="number"
			min="0"
			name="issuance-rate"
			placeholder="e.g. 1 AlphaCoin - 1 FUSD"
			bind:value={$daoData.tokenomics.initialRound.issuanceRate}
		/>
		<label for="reserve-rate">Reserve Rate</label>
		<input
			type="number"
			min="0"
			max="100"
			name="reserve-rate"
			placeholder="20%"
			bind:value={$daoData.tokenomics.initialRound.reserveRate}
		/>
	{:else if $daoData.tokenomics.tokenType === TokenTypes.COMMUNITY}
		<label for="supply">Total Supply</label>
		<input
			type="text"
			name="supply"
			placeholder="e.g. 1.000.000"
			bind:value={$daoData.tokenomics.totalSupply}
		/>
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
			margin-bottom: 2rem;
		}
	}
</style>
