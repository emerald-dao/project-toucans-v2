<script lang="ts">
	import Pagination from '$components/atoms/Pagination.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import NFTCard from './atoms/NFTCard.svelte';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';

	export let NFTs: {
		[collectionIdentifier: string]: Nft[];
	};
	export let pageSize = 5;
	export let clickable = false;
	export let selectedCollection = '';

	const dispatch = createEventDispatcher();

	let displayedNfts: Nft[] = [];

	export let selectedNFTIds: string[] = [];

	let collectionIdentifiers = Object.keys(NFTs);

	onMount(async () => {
		selectedCollection = collectionIdentifiers[0];
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
	$: currentPageNFTs = displayedNfts.slice(pageStart, pageEnd);
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
				/>
			{/each}
		</div>
		<Pagination bind:pageStart bind:pageEnd amountOfItems={displayedNfts.length} {pageSize} />
	{/if}
</div>

<style lang="scss">
	select {
		max-width: 250px;
	}

	.nfts-grid {
		display: grid;
		grid-gap: var(--space-3);
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	}

	.off {
		color: var(--clr-text-off);
	}
</style>
