<script type="ts">
	import { Currency } from '@emerald-dao/component-library';
	import { paymentActiveStep } from '$lib/features/payments/stores/PaymentSteps';
	import validationSuite from './validation';
	import { fade } from 'svelte/transition';
	import { paymentData } from '$lib/features/payments/stores/PaymentData';
	import SpecialMessage from '../../atoms/SpecialMessage.svelte';
	import CurrencySelect from '$components/atoms/CurrencySelect.svelte';
	import { ECurrencies } from '$lib/types/common/enums';
	import CurrencyInput from '$components/atoms/CurrencyInput.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import FeeWarning from '../../atoms/FeeWarning.svelte';
	import { getCatalogSpecificNFTs } from '$flow/actions';
	import NFTsList from '$lib/features/nft-treasury/components/nfts-list/NFTsList.svelte';
	import { user } from '$stores/flow/FlowStore';
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import { onMount } from 'svelte';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';
	import CollectionSelector from '$lib/features/nft-treasury/components/nfts-list/atoms/CollectionSelector.svelte';

	export let isValid = false;
	export let daoData: DAOProject;

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = validationSuite($paymentData, target.name);

		isValid = res.isValid();
	};

	let res = validationSuite.get();

	let projectNFTsCollections = daoData.onChainData.allowedNFTCollections;
	let currencies: string[];

	if (daoData.generalInfo.token_symbol) {
		currencies = [ECurrencies.FLOW, ECurrencies.USDC, daoData.generalInfo.token_symbol, 'NFTs'];
	} else {
		currencies = [ECurrencies.FLOW, ECurrencies.USDC, 'NFTs'];
	}

	$: if ($paymentData.NFTs && $paymentData.currency === 'NFTs') {
		if ($paymentData.NFTs.length > 0) {
			isValid = true;
		} else if ($paymentData.NFTs.length === 0) {
			isValid = false;
		}
	}

	let storedUserNFTs: {
		[collectionIdentifier: string]: Nft[];
	} = {};
	let userNFTs: Promise<{
		[collectionIdentifier: string]: Nft[];
	}>;
	onMount(async () => {
		if (projectNFTsCollections.length > 0) {
			$paymentData.NFTCollection = projectNFTsCollections[0];
			fetchUserNFTs();
		}
	});

	async function fetchUserNFTs() {
		$paymentData.NFTs = [];
		userNFTs = new Promise(async (resolve, reject) => {
			if (!storedUserNFTs[$paymentData.NFTCollection]) {
				storedUserNFTs[$paymentData.NFTCollection] = await getCatalogSpecificNFTs(
					$paymentData.NFTCollection,
					$user.addr
				);
			}
			resolve(storedUserNFTs[$paymentData.NFTCollection]);
		});
	}
</script>

<form
	id="fund-form"
	on:submit|preventDefault={paymentActiveStep.increment}
	autocomplete="off"
	in:fade={{ duration: 200 }}
>
	{#if $paymentData.type === 'donation'}
		{#if daoData.hasToken}
			<CurrencySelect {currencies} bind:value={$paymentData.currency} />
		{:else}
			<CurrencySelect {currencies} bind:value={$paymentData.currency} />
		{/if}
	{/if}
	{#if $paymentData.type === 'fund'}
		<FeeWarning paymentCurrency={$paymentData.currency} />
	{/if}
	{#if $paymentData.currency === 'NFTs'}
		{#if !$user.addr}
			<p class="small" style="padding: var(--space-7) 0;">
				<em> Please log in to your account to view your NFTs collections! </em>
			</p>
		{:else if projectNFTsCollections.length > 0}
			<div class="column-3">
				<CollectionSelector
					bind:selectedCollection={$paymentData.NFTCollection}
					collectionIdentifiers={projectNFTsCollections}
					on:collectionChange={fetchUserNFTs}
				/>
				{#await userNFTs}
					<span class="small"><i>Loading...</i></span>
				{:then userCatalogNFTs}
					<NFTsList
						bind:selectedNFTIds={$paymentData.NFTs}
						selectedCollection={$paymentData.NFTCollection}
						NFTs={userCatalogNFTs}
						pageSize={3}
						clickable={true}
						sortNFTs={false}
					/>
				{/await}
			</div>
		{:else}
			<span class="small"><i>This DAO has not set up any NFT collections yet.</i></span>
		{/if}
	{:else}
		<CurrencyInput
			autofocus
			currency={$paymentData.currency}
			errors={res.getErrors('amount')}
			isValid={res.isValid('amount')}
			fontSize="var(--font-size-7)"
			hasBorder={false}
			on:input={(input) => handleChange(input.detail)}
			bind:value={$paymentData.amount}
		/>
	{/if}
	{#if $paymentData.currency === 'NFTs' && $paymentData.NFTs}
		<div class="row-2">
			<IconCircle icon={$paymentData.NFTs.length} color="neutral" />
			{$paymentData.NFTs.length == 1 ? 'NFT' : 'NFTs'} selected
		</div>
	{/if}
	<SpecialMessage bind:message={$paymentData.specialMessage} />
	{#if $paymentData.type === 'fund' && $paymentData.issuanceRate}
		<div class="funding-data-wrapper">
			<div class="row-2 align-center">
				<span class="small">Issuance rate:</span>
				<div class="surface">
					<Currency
						currency={$paymentData.tokenName}
						amount={$paymentData.issuanceRate}
						color="heading"
						fontSize="var(--font-size-1)"
						decimalNumbers={2}
					/>
				</div>
				<span class="small">minted per</span>
				<div class="surface">
					<Currency
						currency={$paymentData.currency}
						amount={1}
						color="heading"
						fontSize="var(--font-size-1)"
					/>
				</div>
				<span class="small">funded</span>
			</div>
			<div class:receipts-grid={$paymentData.reserveRate > 0}>
				<div class="issuance-secondary-wrapper">
					<span class="small">You will receive</span>
					<Currency
						currency={$paymentData.tokenName}
						amount={$paymentData.amount *
							0.98 *
							$paymentData.issuanceRate *
							(1 - $paymentData.reserveRate)}
						color="heading"
						decimalNumbers={2}
					/>
					<span class="issuance xsmall"
						>{`${100 - $paymentData.reserveRate * 100}% of the minted tokens after tax`}</span
					>
				</div>
				{#if $paymentData.reserveRate > 0}
					<div class="issuance-secondary-wrapper">
						<span class="small">DAO treasury will receive</span>
						<Currency
							currency={$paymentData.tokenName}
							amount={$paymentData.amount *
								0.98 *
								$paymentData.issuanceRate *
								$paymentData.reserveRate}
							color="heading"
							decimalNumbers={2}
						/>
						<span class="issuance xsmall"
							>{`${$paymentData.reserveRate * 100}% of the minted tokens after tax`}</span
						>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</form>

<style type="scss">
	form {
		width: 100%;
		// margin-bottom: var(--space-9);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);

		.row-2 {
			font-size: var(--font-size-0);
			gap: var(--space-2);
			align-items: center;
			padding: 1px 6px;
		}

		.funding-data-wrapper {
			margin-top: var(--space-8);

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

			.receipts-grid {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: var(--space-4);
			}
		}
	}
</style>
