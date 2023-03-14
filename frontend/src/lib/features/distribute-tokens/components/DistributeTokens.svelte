<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
	import DistributionStaging from './sections/DistributionStaging.svelte';
	import DistributionForms from './sections/DistributionForms.svelte';
	import { Button, Currency } from '@emerald-dao/component-library';
	import { fly } from 'svelte/transition';
	import { setContext } from 'svelte';
	import { mintTokens } from '../functions/mintTokens';
	import { withdrawTokens } from '../functions/withdrawTokens';
	import type { ECurrencies } from '$lib/types/common/enums';

	export let daoData: DAOProject;
	export let distributionType: 'mint' | 'withdraw';

	setContext('daoData', daoData);

	let currencyToDistribute: ECurrencies | string =
		distributionType === 'mint'
			? daoData.generalInfo.token_symbol
			: Object.entries(daoData.onChainData.treasuryBalances)[0][0];
	$: availableBalance =
		distributionType === 'mint'
			? undefined
			: Number(daoData.onChainData.treasuryBalances[currencyToDistribute]);

	let distStaging: Distribution[] = [];

	let formDist: Distribution = {
		account: '',
		tokens: 0
	};
	let csvDist: Distribution[] = [];

	const addToStaging = (validForm: boolean) => {
		if (validForm) {
			distStaging = [...distStaging, { ...formDist }, ...csvDist];
		} else {
			distStaging = [...distStaging, ...csvDist];
		}
	};

	const distributeTokens = () => {
		if (distributionType === 'mint') {
			mintTokens(daoData, distStaging);
		} else if (distributionType === 'withdraw') {
			withdrawTokens(daoData, distStaging);
		}
	};
</script>

<div class="main-wrapper">
	<div class="forms-wrapper sub-wrapper column-8">
		<div class="introduction">
			{#if distributionType === 'mint'}
				<h5>Mint</h5>
				<p class="small">
					{`Mint $${daoData.generalInfo.token_symbol} tokens to external wallets.`}
				</p>
			{:else}
				<h5>Withdraw</h5>
				<p class="small">Withdraw tokens from your treasury to external wallets.</p>
			{/if}
		</div>
		<slot />
		{#if distributionType === 'withdraw'}
			<div class="radio-tabs" id="currencies">
				{#each Object.entries(daoData.onChainData.treasuryBalances) as [currency], i}
					<label>
						{currency}
						<input
							type="radio"
							id="flow"
							name="currency"
							value={currency}
							bind:group={currencyToDistribute}
						/>
					</label>
				{/each}
			</div>
			{#if distributionType === 'withdraw' && daoData.onChainData.treasuryBalances[currencyToDistribute] != undefined}
				<div class="row-2 align-center">
					<span class="small">Available balance:</span>
					<Currency
						amount={Number(daoData.onChainData.treasuryBalances[currencyToDistribute])}
						currency={currencyToDistribute}
						color="heading"
					/>
				</div>
			{/if}
		{/if}
		{#if (distributionType === 'withdraw' && daoData.onChainData.treasuryBalances[currencyToDistribute] != undefined && Number(daoData.onChainData.treasuryBalances[currencyToDistribute]) > 0) || distributionType === 'mint'}
			<DistributionForms
				bind:formDist
				bind:csvDist
				bind:currencyToDistribute
				bind:availableBalance
				{addToStaging}
			/>
		{/if}
	</div>
	<div class="dist-wrapper sub-wrapper card">
		<DistributionStaging bind:distStaging tokenName={daoData.generalInfo.token_symbol} />
		{#if distStaging.length > 0}
			<div transition:fly|local={{ y: 10, duration: 500, delay: 100 }}>
				<Button width="full-width" on:click={distributeTokens}>Distribute</Button>
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

			.introduction {
				h5 {
					margin-bottom: var(--space-2);
					margin-top: 0;
				}
			}

			.dist-wrapper {
				display: flex;
				flex: 1;
				flex-direction: column;
				gap: 1.4rem;
				transition: 3s;
				padding: var(--space-8);
			}
		}
	}
</style>
