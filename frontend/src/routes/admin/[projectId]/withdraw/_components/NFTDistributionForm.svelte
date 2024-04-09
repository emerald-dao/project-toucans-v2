<script type="ts">
	import { fade } from 'svelte/transition';
	import NFTsList from '$lib/features/nft-treasury/components/nfts-list/NFTsList.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import NftAddressInput from './atoms/NftAddressInput.svelte';
	import { Button } from '@emerald-dao/component-library';
	import { canReceiveNFTCollection, getProjectSpecificNFTTreasury } from '$flow/actions';
	import Icon from '@iconify/svelte';
	import { withdrawNFTs } from '$lib/features/distribute-tokens/functions/withdrawNFTs';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';
	import SpecialMessage from '$lib/features/payments/components/atoms/SpecialMessage.svelte';
	import CollectionSelector from '$lib/features/nft-treasury/components/nfts-list/atoms/CollectionSelector.svelte';

	export let activeDao: DAOProject;

	let address: string;
	let isAddressValid: boolean;
	let reasonMessage: string = '';
	let selectedNFTIds: string[] = [];

	let projectNFTsCollections = activeDao.onChainData.allowedNFTCollections;
	let selectedCollection: string = projectNFTsCollections[0];

	let storedUserNFTs: {
		[collectionIdentifier: string]: Nft[];
	} = {};

	async function fetchUserNFTs(collectionIdentifier: string) {
		selectedNFTIds = [];
		if (!storedUserNFTs[collectionIdentifier]) {
			storedUserNFTs[collectionIdentifier] = await getProjectSpecificNFTTreasury(
				activeDao.generalInfo.owner,
				activeDao.generalInfo.project_id,
				collectionIdentifier
			);
		}
		return storedUserNFTs[collectionIdentifier];
	}

	const resetDistributionForm = () => {
		address = '';
		selectedNFTIds = [];
	};

	const handleCreateWithdrawNftsAction = async () => {
		const canReceiveNFT = await canReceiveNFTCollection(address, selectedCollection);

		if (!canReceiveNFT) {
			alert(
				"The user cannot receive this type of NFT because they don't have a collection set up."
			);
		}

		withdrawNFTs(activeDao, selectedCollection, selectedNFTIds, address, reasonMessage);
		resetDistributionForm();
	};

	let resetAddressValidation: () => void;
</script>

<div in:fade|local={{ duration: 200 }} class="main-wrapper">
	<div class="content-wrapper">
		<NftAddressInput
			bind:address
			bind:isValid={isAddressValid}
			bind:handleChange={resetAddressValidation}
			collectionId={selectedCollection}
		/>
		<div class="column-3">
			<CollectionSelector
				bind:selectedCollection
				collectionIdentifiers={projectNFTsCollections}
				on:collectionChange={resetAddressValidation}
			/>
			{#await fetchUserNFTs(selectedCollection)}
				<span class="small"><i>Loading...</i></span>
			{:then userCatalogNFTs}
				<NFTsList
					bind:selectedNFTIds
					{selectedCollection}
					NFTs={userCatalogNFTs}
					clickable={true}
				/>
			{/await}
		</div>
		<div class="special-message">
			<SpecialMessage bind:message={reasonMessage} messageText="Add a reason for withdrawl" />
		</div>
	</div>
	<Button
		on:click={handleCreateWithdrawNftsAction}
		width="extended"
		state={isAddressValid && selectedNFTIds.length > 0 ? 'active' : 'disabled'}
	>
		{#if selectedNFTIds.length === 1}
			{`Distribute 1 NFT`}
		{:else if selectedNFTIds.length === 0}
			{`Distribute NFTs`}
		{:else}
			{`Distribute ${selectedNFTIds.length} NFTs`}
		{/if}
		<Icon icon="tabler:arrow-narrow-right" />
	</Button>
</div>

<style lang="scss">
	.main-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
		align-items: end;
		width: 100%;
		justify-content: space-between;

		.content-wrapper {
			width: 100%;

			.special-message {
				margin-top: var(--space-3);
			}
		}
	}
</style>
