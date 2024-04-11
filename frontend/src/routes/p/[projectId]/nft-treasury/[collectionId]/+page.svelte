<script lang="ts">
	import NftCard from '$lib/features/nft-treasury/components/nfts-list/atoms/NFTCard.svelte';

	export let data;
</script>

<div class="nfts-grid">
	{#each data.projectSpecificNFTTreasury as nft (nft.id)}
		<NftCard
			{nft}
			clickable={false}
			isSelected={false}
			selectedCollection={data.onChainData.allowedNFTCollections[2]}
			donatedBy={undefined}
		/>
	{/each}
</div>

<style lang="scss">
	.nfts-grid {
		display: grid;
		grid-gap: var(--space-3);
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
	}
</style>
