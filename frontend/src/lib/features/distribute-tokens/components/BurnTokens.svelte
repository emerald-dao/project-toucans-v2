<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
	import DistributionStaging from './sections/DistributionStaging.svelte';
	import DistributionForms from './sections/DistributionForms.svelte';
	import { Button, Currency, InputWrapper } from '@emerald-dao/component-library';
	import { fly } from 'svelte/transition';
	import { setContext } from 'svelte';
	import { mintTokens } from '../functions/mintTokens';
	import { withdrawTokens } from '../functions/withdrawTokens';
	import type { ECurrencies } from '$lib/types/common/enums';
	import { burnTokensExecution } from '$flow/actions';

	export let daoData: DAOProject;

	setContext('daoData', daoData);

	let currencyToDistribute: string = daoData.generalInfo.token_symbol;
	$: availableBalance = Number(daoData.onChainData.treasuryBalances[currencyToDistribute]);
	let amount = 0;
	let isValid = true;
	let errors: string[] = [];

	const handleChange = (input: Event) => {
		if (amount <= availableBalance) {
			isValid = true;
			errors = [];
		} else {
			isValid = false;
			errors = ['Cannot burn more than the available balance.'];
		}
	};
</script>

<div class="main-wrapper">
	<div class="forms-wrapper sub-wrapper column-8">
		<div class="introduction">
			<h5>Create Burn Action</h5>
			<p class="small">Burn ${currencyToDistribute} tokens from your treasury.</p>
		</div>
		<slot />
		{#if daoData.onChainData.treasuryBalances[currencyToDistribute] != undefined}
			<div class="row-2 align-center">
				<span class="small">Available balance:</span>
				<Currency
					amount={Number(daoData.onChainData.treasuryBalances[currencyToDistribute])}
					currency={currencyToDistribute}
					color="heading"
				/>
			</div>
		{/if}
		{#if daoData.onChainData.treasuryBalances[currencyToDistribute] != undefined && Number(daoData.onChainData.treasuryBalances[currencyToDistribute]) > 0}
			<form
				id="dist-form"
				on:submit|preventDefault={() =>
					burnTokensExecution(daoData.generalInfo.project_id, amount.toString())}
				autocomplete="off"
				class="wrapper"
			>
				<InputWrapper
					name="amount"
					label="Amount"
					iconText={`$${currencyToDistribute}`}
					{errors}
					{isValid}
				>
					<input name="amount" type="text" bind:value={amount} on:input={handleChange} />
				</InputWrapper>
				<Button form="dist-form" width="full-width" state={isValid ? 'active' : 'disabled'}>
					Create Burn Action
				</Button>
			</form>
		{:else}
			<div class="row-2 align-center">
				<span class="small no-tokens-message"><em>No tokens available to burn.</em></span>
			</div>
		{/if}
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: grid;
		grid-template-columns: 2fr 3fr;
		gap: var(--space-13);
		height: 100%;
		flex: 1;

		.sub-wrapper {
			display: flex;
			flex: 1;
			flex-direction: column;

			.no-tokens-message {
				color: var(--clr-text-off);
			}

			.introduction {
				h5 {
					margin-bottom: var(--space-2);
					margin-top: 0;
				}
			}
		}
	}
</style>
