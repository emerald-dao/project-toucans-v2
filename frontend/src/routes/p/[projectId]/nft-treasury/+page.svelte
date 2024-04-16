<script lang="ts">
	import { page } from '$app/stores';
	import Pagination from '$components/atoms/Pagination.svelte';
	import NftCard from '$lib/features/nft-treasury/components/nfts-list/atoms/NFTCard.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface.js';
	import { getContext } from 'svelte';

	export let data;

	const daoData: DAOProject = getContext('daoData');

	const allNFTs = Object.entries(data.projectNFTTreasury).flatMap(([identifier, nfts]) =>
		nfts.map((nft) => ({ nft, identifier }))
	);

	let pageSize = 8;
	let pageStart: number;
	let pageEnd: number;
	$: currentPageNFTs = allNFTs.slice(pageStart, pageEnd);
</script>

<ul class="row-4">
	{#each data.onChainData.allowedNFTCollections as collection}
		<li>
			<a href={`/p/${$page.params.projectId}/nft-treasury/${collection}`}>{collection}</a>
		</li>
	{/each}
</ul>
<div class="nfts-container">
	{#each currentPageNFTs as nftObject (nftObject.nft.id)}
		<NftCard
			nft={nftObject.nft}
			clickable={false}
			isSelected={false}
			selectedCollection={nftObject.identifier}
			donatedBy={daoData.generalInfo.nftUuidOwnerMap[nftObject.nft.uuid]}
		/>
	{/each}
</div>

<Pagination bind:pageStart bind:pageEnd amountOfItems={allNFTs.length} {pageSize} />

<style lang="scss">
	.nfts-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		flex-wrap: wrap;
		gap: var(--space-4);
	}
</style>
