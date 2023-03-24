<script lang="ts">
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Currency, Range } from '@emerald-dao/component-library';
	import { getContext } from 'svelte';

	const daoData: DAOProject = getContext('daoData');

	let claimAmount = 0;

	$: holdingPercentage = Number(daoData.userBalance) / Number(daoData.onChainData.totalSupply);
	$: maxClaimAmount = holdingPercentage * Number(daoData.onChainData.overflowBalance);
	$: exchangeAmount = (claimAmount / maxClaimAmount) * Number(daoData.userBalance);
</script>

<div class="row-space-between">
	<div class="column-1">
		<span class="small">Available overflow</span>
		<Currency
			amount={Number(daoData.onChainData.overflowBalance)}
			currency={daoData.onChainData.paymentCurrency}
			color="heading"
		/>
	</div>
	<div class="column-1">
		<span class="small">Your balance</span>
		<Currency
			amount={Number(daoData.userBalance)}
			currency={daoData.generalInfo.token_symbol}
			color="heading"
		/>
	</div>
	<div class="column-1">
		<span class="small">Circulating supply</span>
		<Currency
			amount={Number(daoData.onChainData.totalSupply)}
			currency={daoData.generalInfo.token_symbol}
			color="heading"
		/>
	</div>
</div>
<Range id="range" min={0} max={maxClaimAmount} initialValue={0} bind:value={claimAmount} />
<div class="card-primary row-12 align-center justify-center">
	<div class="column-1 align-end">
		<span class="small">You will receive</span>
		<Currency amount={claimAmount} currency={daoData.onChainData.paymentCurrency} color="heading" />
	</div>
	<IconCircle
		icon="tabler:arrows-exchange"
		color={claimAmount > 0 ? 'primary' : 'neutral'}
		width="1.6rem"
	/>
	<div class="column-1">
		<span class="small">You will give</span>
		<Currency amount={exchangeAmount} currency={daoData.generalInfo.token_symbol} color="heading" />
	</div>
</div>

<style lang="scss">
	.card-primary {
		border: none;
	}
</style>
