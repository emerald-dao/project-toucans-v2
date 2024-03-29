<script lang="ts">
	import Pagination from '$components/atoms/Pagination.svelte';
	import NFTCard from './atoms/NFTCard.svelte';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';
	import AnimatedSearchBar from '$components/search-bar/AnimatedSearchBar.svelte';

	export let NFTs: Nft[];
	export let sortNFTs: boolean = false;
	export let pageSize = 5;
	export let clickable = false;
	export let selectedCollection: string;
	export let nftUuidOwnerMap: { [uuid: string]: string } = {};
	export let selectedNFTIds: string[] = [];

	if (sortNFTs && selectedCollection === 'NFLAllDay') {
		let tierRating = {
			COMMON: 1,
			UNCOMMON: 2,
			RARE: 3,
			LEGENDARY: 4
		};
		NFTs = NFTs.sort(
			(a, b) => tierRating[b.traits['editionTier']] - tierRating[a.traits['editionTier']]
		);
	}

	let filteredNfts: Nft[] = NFTs;

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

<AnimatedSearchBar
	items={NFTs}
	bind:filteredItems={filteredNfts}
	searchTerms={['name', 'serial']}
	placeholder="Search NFT name or serial..."
/>
{#if filteredNfts.length === 0}
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

<style lang="scss">
	.nfts-grid {
		display: grid;
		grid-gap: var(--space-3);
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
	}

	.off {
		color: var(--clr-text-off);
	}
</style>
