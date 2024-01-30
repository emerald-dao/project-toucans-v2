<script lang="ts">
	import NftCollectionSelectCard from '$lib/features/nft-treasury/components/nft-collections-list/NFTCollectionSelectCard.svelte';
	import type { NftCollection } from '$lib/features/nft-treasury/types/nft-collection.interface';
	import Pagination from '$components/atoms/Pagination.svelte';
	import SearchBar from '$components/search-bar/SearchBar.svelte';
	import { getCatalogByCollectionIDs, getNFTCatalog } from '$flow/actions';
	import { getContext } from 'svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	const daoData = getContext<DAOProject>('activeDao');

	let collectionsList: NftCollection[] = [];
	let filteredCollections: NftCollection[] = [];

	const projectNFTs = getCatalogByCollectionIDs(daoData.onChainData.allowedNFTCollections).then(
		(collections) => {
			collectionsList = Object.values(collections);

			filteredCollections = collectionsList;
		}
	);

	let pageStart: number;
	let pageEnd: number;

	$: currentPageCollections = filteredCollections.slice(pageStart, pageEnd);

	let selectedCollections: string[] = [];
</script>

{#if daoData.onChainData.allowedNFTCollections.length === 0}
	<span class="small">
		<em> This DAO has no active NFT collections. </em>
	</span>
{:else}
	{#await projectNFTs}
		<span class="small">
			<em> Searching collections... </em>
		</span>
	{:then}
		{#if collectionsList.length > 0}
			<SearchBar
				items={collectionsList}
				bind:filteredItems={filteredCollections}
				searchTerms={['name', 'identifier']}
				placeholder="Search collections.."
			/>
			<div class="collections-wrapper">
				{#each currentPageCollections as nftCollection (nftCollection.identifier)}
					<NftCollectionSelectCard {nftCollection} bind:selectedCollections />
				{/each}
			</div>
			<Pagination
				amountOfItems={filteredCollections.length}
				bind:pageStart
				bind:pageEnd
				pageSize={4}
			/>
		{:else}
			<span class="small">
				<em> No collections found. </em>
			</span>
		{/if}
	{/await}
{/if}

<style lang="scss">
	.collections-wrapper {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, 1fr);
		gap: var(--space-3);
	}

	em {
		color: var(--clr-text-off);
	}
</style>
