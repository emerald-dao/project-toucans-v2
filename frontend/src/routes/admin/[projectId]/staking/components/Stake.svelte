<script type="ts">
	import { Button, Currency } from '@emerald-dao/component-library';
	import { fade } from 'svelte/transition';
	import CurrencySelect from '$components/atoms/CurrencySelect.svelte';
	import { ECurrencies } from '$lib/types/common/enums';
	import CurrencyInput from '$components/atoms/CurrencyInput.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { getStableSwapPoolInfo, stakeFlowExecution, unstakeFlowExecution } from '$flow/actions';

	export let daoData: DAOProject;

	let currencyIn = ECurrencies.FLOW;
	$: amountIn = 0;
	let amountOut = 0;
	let timeout;
	let price = 0;

	$: availableBalance = Number(daoData.onChainData.treasuryBalances[currencyIn]);

	let isValid = true;
	let errors: string[] = [];

	const handleChange = (input: Event) => {
		clearTimeout(timeout);
		if (!amountIn) {
			amountIn = 0;
		}
		timeout = setTimeout(async () => {
			amountOut = await getStableSwapPoolInfo(amountIn, currencyIn);
			price = amountOut / amountIn;
		}, 500);

		if (amountIn <= availableBalance) {
			isValid = true;
			errors = [];
		} else {
			isValid = false;
			errors = [
				`Cannot ${
					currencyIn === ECurrencies.FLOW ? 'stake' : 'unstake'
				} more than the available balance.`
			];
		}
	};

	async function runTransaction() {
		if (currencyIn === ECurrencies.FLOW) {
			// stake with 1% slippage
			await stakeFlowExecution(
				daoData.generalInfo.project_id,
				daoData.generalInfo.owner,
				amountIn,
				amountOut * 0.99
			);
		} else if (currencyIn === ECurrencies.stFlow) {
			await unstakeFlowExecution(
				daoData.generalInfo.project_id,
				daoData.generalInfo.owner,
				amountIn,
				amountOut * 0.99
			);
		}
	}
</script>

<form
	id="stake-form"
	on:submit|preventDefault={runTransaction}
	autocomplete="off"
	in:fade={{ duration: 200 }}
>
	<div class="introduction">
		{#if currencyIn === ECurrencies.FLOW}
			<h5>Stake $FLOW</h5>
			<span class="small">Stake your $FLOW by swapping to $stFlow.</span>
		{:else if currencyIn === ECurrencies.stFlow}
			<h5>Unstake $FLOW</h5>
			<span class="small">Unstake by swapping your $stFlow for $FLOW.</span>
		{/if}
	</div>
	<div>
		<CurrencySelect currencies={[ECurrencies.FLOW, ECurrencies.stFlow]} bind:value={currencyIn} />
	</div>
	{#if daoData.onChainData.treasuryBalances[currencyIn] != undefined}
		<div class="row-2 align-center">
			<span class="small">Available balance:</span>
			<Currency
				amount={availableBalance}
				currency={currencyIn}
				color="heading"
				decimalNumbers={8}
			/>
		</div>
	{/if}
	{#if daoData.onChainData.treasuryBalances[currencyIn] != undefined && availableBalance > 0}
		<CurrencyInput
			autofocus
			currency={currencyIn}
			{isValid}
			{errors}
			fontSize="var(--font-size-7)"
			hasBorder={false}
			on:input={(input) => handleChange(input.detail)}
			bind:value={amountIn}
		/>
		{#if amountIn}
			<div>
				<div class="row-2 align-center">
					<span class="small">Price:</span>
					<div class="surface">
						<Currency
							currency={currencyIn}
							amount={1}
							color="heading"
							fontSize="var(--font-size-1)"
							decimalNumbers={2}
						/>
					</div>
					<span class="small">≈</span>
					<div class="surface">
						<Currency
							currency={currencyIn === ECurrencies.FLOW ? ECurrencies.stFlow : ECurrencies.FLOW}
							amount={price}
							color="heading"
							fontSize="var(--font-size-1)"
							decimalNumbers={2}
						/>
					</div>
				</div>
				<div>
					<div class="issuance-secondary-wrapper">
						<span class="small">You will receive</span>
						<Currency
							currency={currencyIn === ECurrencies.FLOW ? ECurrencies.stFlow : ECurrencies.FLOW}
							amount={amountOut}
							color="heading"
							decimalNumbers={2}
						/>
					</div>
				</div>
			</div>
			<Button form="stake-form" width="full-width" state={isValid ? 'active' : 'disabled'}>
				Create {currencyIn === ECurrencies.FLOW ? 'Staking' : 'Unstaking'} Action
			</Button>
		{/if}
	{:else}
		<div class="row-2 align-center">
			<span class="small no-tokens-message">
				<em>
					No tokens available to {currencyIn === ECurrencies.FLOW ? 'stake' : 'unstake'}.
				</em>
			</span>
		</div>
	{/if}
</form>

<style type="scss">
	form {
		width: 40%;
		margin-bottom: var(--space-9);
		display: flex;
		flex-direction: column;
		gap: var(--space-8);

		.introduction {
			h5 {
				margin-bottom: var(--space-2);
				margin-top: 0;
			}
		}

		.surface {
			background-color: var(--clr-surface-secondary);
			padding: 2px var(--space-2);
			border-radius: var(--radius-1);
		}

		.issuance-secondary-wrapper {
			background-color: var(--clr-surface-primary);
			padding: var(--space-4);
			border-radius: var(--radius-3);
			margin-top: var(--space-4);

			.issuance {
				color: var(--clr-text-off);
			}
		}
	}
</style>
