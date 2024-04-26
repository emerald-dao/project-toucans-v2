<script type="ts">
	import { fade } from 'svelte/transition';
	import NFTsList from '$lib/features/nft-treasury/components/nfts-list/NFTsList.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button } from '@emerald-dao/component-library';
	import { getProjectSpecificNFTTreasury } from '$flow/actions';
	import Icon from '@iconify/svelte';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';
	import CollectionSelector from '$lib/features/nft-treasury/components/nfts-list/atoms/CollectionSelector.svelte';
	import BurnNftsModal from './BurnNftsModal.svelte';

	export let activeDao: DAOProject;

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
</script>

<div in:fade|local={{ duration: 200 }} class="main-wrapper">
	<div class="content-wrapper">
		<div class="column-3">
			<CollectionSelector bind:selectedCollection collectionIdentifiers={projectNFTsCollections} />
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
	</div>
	<BurnNftsModal
		{selectedNFTIds}
		selectedCollectionId={selectedCollection}
		activeDaoId={activeDao.generalInfo.project_id}
	/>
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
		}
	}
</style>
