<script lang="ts">
	import Pagination from '$components/atoms/Pagination.svelte';
	import NFTCard from './atoms/NFTCard.svelte';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';
	import AnimatedSearchBar from '$components/search-bar/AnimatedSearchBar.svelte';

	export let NFTs: Nft[];
	export let sortNFTs: boolean = false;
	export let pageSize = 5;
	export let clickable = false;
	export let selectedCollection: string | null;
	export let nftUuidOwnerMap: { [uuid: string]: string } = {};
	export let selectedNFTIds: string[] = [];
	export let nftTreasuryPage: boolean = false;

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

{#if !nftTreasuryPage}
	<AnimatedSearchBar
		items={NFTs}
		bind:filteredItems={filteredNfts}
		searchTerms={['name', 'serial']}
		placeholder="Search NFT name or serial..."
	/>
{/if}
{#if currentPageNFTs.length === 0}
	<p class="small off">
		<em> Sorry! We didn't find NFTs from this collection. </em>
	</p>
{:else}
	<div
		class:treasury-page={nftTreasuryPage}
		class:treasury-widget={!nftTreasuryPage}
		class="nfts-grid"
	>
		{#each currentPageNFTs as nft (nft.id)}
			<NFTCard
				{nft}
				{clickable}
				on:click={() => handleNFTClick(nft.id)}
				isSelected={selectedNFTIds.includes(nft.id)}
				donatedBy={nftUuidOwnerMap[nft.uuid]}
				{nftTreasuryPage}
				{selectedCollection}
			/>
		{/each}
	</div>
	<Pagination
		bind:pageStart
		bind:pageEnd
		amountOfItems={filteredNfts.length}
		{pageSize}
		scrollToTopOnChange={nftTreasuryPage}
	/>
{/if}

<style lang="scss">
	.nfts-grid {
		display: grid;
	}
	.treasury-page {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: var(--space-4);

		@include mq('small') {
			grid-template-columns: repeat(2, 1fr);
		}

		@include mq('medium') {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.treasury-widget {
		grid-gap: var(--space-3);
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
	}

	.off {
		color: var(--clr-text-off);
	}
</style>
