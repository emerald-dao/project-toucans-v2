<script lang="ts">
	import { page } from '$app/stores';
	import NftCard from '$lib/features/nft-treasury/components/nfts-list/atoms/NFTCard.svelte';

	export let data;
</script>

<ul>
	{#each data.onChainData.allowedNFTCollections as collection}
		<li><a href="/p/{$page.params.projectId}/nft-treasury/{collection}">{collection}</a></li>
	{/each}
</ul>

{#each Object.keys(data.projectNFTTreasury) as collection}
	<h2>{collection}</h2>
	<div class="nfts-container">
		{#each data.projectNFTTreasury[collection] as nft (nft.id)}
			<NftCard
				{nft}
				clickable={false}
				isSelected={false}
				selectedCollection={data.onChainData.allowedNFTCollections[2]}
				donatedBy={undefined}
			/>
		{/each}
	</div>
{/each}

<style lang="scss">
	.nfts-container {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		padding: var(--space-8) 0;
	}
</style>
