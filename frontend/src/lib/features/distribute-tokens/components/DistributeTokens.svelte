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

	import { lockTokens } from '../functions/lockTokens';
	import Icon from '@iconify/svelte';
	import { getProjectNFTTreasury } from '$flow/actions';
	import NfTsDistributionForm from './sections/NFTsDistributionForm.svelte';
	import { withdrawNFTs } from '../functions/withdrawNFTs';
	import NfTsList from '$components/atoms/NFTsList.svelte';

	export let daoData: DAOProject;
	export let distributionType: 'mint' | 'withdraw' | 'lock';

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
		address: '',
		amount: 0
	};
	let csvDist: Distribution[] = [];

	const addToStaging = (validForm: boolean) => {
		if (validForm) {
			distStaging = [...distStaging, { ...formDist }, ...csvDist];
		} else {
			distStaging = [...distStaging, ...csvDist];
		}
		formDist = {
			address: '',
			amount: 0
		};
	};

	const distributeTokens = () => {
		if (distributionType === 'mint') {
			mintTokens(daoData, distStaging);
		} else if (distributionType === 'withdraw') {
			if (selectedNFTIds.length > 0) {
				withdrawNFTs(daoData, selectedCollection, selectedNFTIds, address);
			} else {
				withdrawTokens(daoData, distStaging, currencyToDistribute as ECurrencies);
			}
		} else if (distributionType === 'lock') {
			let inputDate;

			if (formDist.date) {
				inputDate = new Date(formDist.date).getTime() / 1000;
			}

			if (inputDate) {
				lockTokens(
					daoData,
					formDist.address,
					currencyToDistribute as ECurrencies,
					inputDate,
					formDist.amount
				);
			}
		}
	};

	let lockInputsAreValid: boolean;

	let nftInputsAreValid: boolean;
	let selectedCollection: string;
	let address: string;
	let selectedNFTIds: string[] = [];
</script>

<div class="main-wrapper">
	<div class="forms-wrapper sub-wrapper column-8">
		<div class="introduction">
			{#if distributionType === 'mint'}
				<h5>Create Mint Action</h5>
				<p class="small">
					{`Mint $${daoData.generalInfo.token_symbol} tokens to external wallets.`}
				</p>
			{:else if distributionType === 'withdraw'}
				<h5>Create Withdraw Action</h5>
				<p class="small">Withdraw tokens/NFTs from your treasury to external wallets.</p>
			{:else if distributionType === 'lock'}
				<h5>Create Lock Action</h5>
				{`Lock tokens from your treasury to external wallets so they can claim later`}
			{/if}
		</div>
		<slot />
		{#if distributionType === 'withdraw' || distributionType === 'lock'}
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
				{#if distributionType !== 'lock'}
					<label>
						NFTs
						<input
							type="radio"
							id="custom"
							name="currency"
							value="NFTs"
							bind:group={currencyToDistribute}
						/>
					</label>
				{/if}
			</div>
			{#if (distributionType === 'withdraw' || distributionType === 'lock') && daoData.onChainData.treasuryBalances[currencyToDistribute] != undefined}
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
		{#if ((distributionType === 'withdraw' || distributionType === 'lock') && daoData.onChainData.treasuryBalances[currencyToDistribute] != undefined && Number(daoData.onChainData.treasuryBalances[currencyToDistribute]) > 0) || distributionType === 'mint'}
			<DistributionForms
				bind:formDist
				bind:csvDist
				bind:currencyToDistribute
				bind:availableBalance
				bind:lockInputsAreValid
				projectOwner={daoData.generalInfo.owner}
				projectId={daoData.generalInfo.project_id}
				{addToStaging}
				forLockTokens={distributionType === 'lock' ? true : false}
			/>
			{#if distributionType === 'lock'}
				<Button
					width="full-width"
					on:click={distributeTokens}
					state={lockInputsAreValid && formDist.date ? 'active' : 'disabled'}
					>Create Lock Action <Icon icon="tabler:arrow-narrow-right" /></Button
				>
			{/if}
		{:else if currencyToDistribute === 'NFTs'}
			{#await getProjectNFTTreasury(daoData.generalInfo.owner, daoData.generalInfo.project_id) then NFTs}
				{#if Object.values(NFTs).every((array) => array.length === 0)}
					<div class="row-2 align-center">
						<span class="small no-tokens-message"><em>No NFTs available to distribute.</em></span>
					</div>
				{:else}
					<div class="column">
						<NfTsDistributionForm
							bind:address
							bind:nftInputsAreValid
							projectOwner={daoData.generalInfo.owner}
							projectId={daoData.generalInfo.project_id}
						/>
						<NfTsList
							bind:selectedNFTIds
							bind:selectedCollection
							{NFTs}
							clickable={true}
							pageSize={3}
						/>
						<Button
							width="full-width"
							on:click={distributeTokens}
							state={nftInputsAreValid && selectedNFTIds.length > 0 ? 'active' : 'disabled'}
							>Distribute NFTs <Icon icon="tabler:arrow-narrow-right" /></Button
						>
					</div>
				{/if}
			{/await}
		{:else}
			<div class="row-2 align-center">
				<span class="small no-tokens-message"><em>No tokens available to distribute.</em></span>
			</div>
		{/if}
	</div>
	{#if distributionType !== 'lock' && daoData.onChainData.treasuryBalances[currencyToDistribute] !== undefined}
		<div class="dist-wrapper sub-wrapper card">
			<DistributionStaging bind:distStaging tokenName={currencyToDistribute} />
			{#if distStaging.length > 0}
				<div transition:fly|local={{ y: 10, duration: 500, delay: 100 }}>
					<Button width="full-width" on:click={distributeTokens}>
						{distributionType === 'withdraw' ? 'Create Withdraw Action' : 'Create Mint Action'}
					</Button>
				</div>
			{/if}
		</div>
	{/if}
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
