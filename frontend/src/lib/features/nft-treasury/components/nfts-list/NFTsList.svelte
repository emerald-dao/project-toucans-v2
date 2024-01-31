<script lang="ts">
	import Pagination from '$components/atoms/Pagination.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import NFTCard from './atoms/NFTCard.svelte';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';
	import AnimatedSearchBar from '$components/search-bar/AnimatedSearchBar.svelte';

	export let NFTs: {
		[collectionIdentifier: string]: Nft[];
	};
	export let pageSize = 5;
	export let clickable = false;
	export let selectedCollection = '';
	export let nftUuidOwnerMap: { [uuid: string]: string } = {};

	const dispatch = createEventDispatcher();

	let displayedNfts: Nft[] = [];
	let filteredNfts: Nft[] = displayedNfts;

	export let selectedNFTIds: string[] = [];

	export let collectionIdentifiers = Object.keys(NFTs);

	onMount(async () => {
		if (!selectedCollection) {
			selectedCollection = collectionIdentifiers[0];
		}
		updateSelectedNFTs();
	});

	const handleCollectionChange = () => {
		updateSelectedNFTs();

		dispatch('collectionChange', selectedCollection);
	};

	const updateSelectedNFTs = () => {
		selectedNFTIds = [];
		displayedNfts = NFTs[selectedCollection] || [];
	};

	const handleNFTClick = (nftId: string) => {
		if (!clickable) {
			return;
		}

		if (selectedNFTIds.includes(nftId)) {
			selectedNFTIds = selectedNFTIds.filter((id) => id !== nftId);
		} else {
			selectedNFTIds = [...selectedNFTIds, nftId];
		}
	};

	let pageStart: number;
	let pageEnd: number;
	$: currentPageNFTs = filteredNfts.slice(pageStart, pageEnd);
</script>

<div class="column-3">
	<div class="column-1">
		<label for="collection">Collection</label>
		<select bind:value={selectedCollection} on:change={handleCollectionChange} name="collection">
			<option value="" disabled selected hidden>Select one collection...</option>
			{#each collectionIdentifiers as collection}
				<option value={collection}>{collection}</option>
			{/each}
		</select>
	</div>
	<AnimatedSearchBar
		items={displayedNfts}
		bind:filteredItems={filteredNfts}
		searchTerms={['name']}
		placeholder="Search NFT name..."
	/>
	{#if currentPageNFTs.length === 0}
		<p class="small off">
			<em> Sorry! We didn't find NFTs from this collection. </em>
		</p>
	{:else}
		<div class="nfts-grid">
			{#each currentPageNFTs as nft (nft.id)}
				<NFTCard
					{nft}
					{clickable}
					on:click={() => handleNFTClick(nft.id)}
					isSelected={selectedNFTIds.includes(nft.id)}
					{selectedCollection}
					donatedBy={nftUuidOwnerMap[nft.uuid]}
				/>
			{/each}
		</div>
		<Pagination bind:pageStart bind:pageEnd amountOfItems={filteredNfts.length} {pageSize} />
	{/if}
</div>

<style lang="scss">
	select {
		max-width: 250px;
	}

	.nfts-grid {
		display: grid;
		grid-gap: var(--space-3);
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
	}

	.off {
		color: var(--clr-text-off);
	}
</style>
