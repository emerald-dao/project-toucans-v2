<script lang="ts">
	import CurrencyInput from '$components/atoms/CurrencyInput.svelte';
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import validationSuite from './validation';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Currency } from '@emerald-dao/component-library';
	import { getContext } from 'svelte';

	export let isValid = false;

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = validationSuite(claimAmount, target.name, maxClaimAmount);

		isValid = res.isValid();
	};

	const daoData: DAOProject = getContext('daoData');

	let res = validationSuite.get();
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
		autofocus
		currency={daoData.onChainData.paymentCurrency}
		errors={res.getErrors('amount')}
		isValid={res.isValid('amount')}
		fontSize="var(--font-size-7)"
		hasBorder={false}
		on:input={(input) => handleChange(input.detail)}
		bind:value={claimAmount}
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
