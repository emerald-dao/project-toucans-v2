<script lang="ts">
	import CurrencyInput from '$components/atoms/CurrencyInput.svelte';
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Currency, Range } from '@emerald-dao/component-library';
	import { getContext } from 'svelte';
	import validationSuite from './validation';

	export let isValid: boolean;

	const daoData: DAOProject = getContext('daoData');

	let claimAmount = 0;

	$: holdingPercentage = Number(daoData.userBalance) / Number(daoData.onChainData.totalSupply);
	$: maxClaimAmount = holdingPercentage * Number(daoData.onChainData.overflowBalance);
	$: exchangeAmount = (claimAmount / maxClaimAmount) * Number(daoData.userBalance);
</script>

<div class="column-4">
	<div class="row-1">
		<span> You can claim a up to </span>
		<Currency
			amount={Math.floor(maxClaimAmount)}
			currency={daoData.onChainData.paymentCurrency}
			color="heading"
		/>
	</div>
	<CurrencyInput
		{validationSuite}
		autofocus={true}
		currency={daoData.onChainData.paymentCurrency}
		maxAmount={maxClaimAmount}
		bind:value={claimAmount}
		bind:isValid
	/>
	<div class="card-primary row-12 align-center justify-center">
		<div class="column-1 align-end">
			<span class="small">You will receive</span>
			<Currency
				amount={claimAmount}
				currency={daoData.onChainData.paymentCurrency}
				color="heading"
			/>
		</div>
		<IconCircle
			icon="tabler:arrows-exchange"
			color={claimAmount === 0 ? 'neutral' : isValid ? 'primary' : 'alert'}
			width="1.6rem"
		/>
		<div class="column-1">
			<span class="small">You will give</span>
			<Currency
				amount={exchangeAmount}
				currency={daoData.generalInfo.token_symbol}
				color="heading"
			/>
		</div>
	</div>
</div>

<style lang="scss">
	.card-primary {
		border: none;
	}
</style>
