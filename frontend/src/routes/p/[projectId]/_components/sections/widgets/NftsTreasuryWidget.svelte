<script lang="ts">
	import NFTsList from '$lib/features/nft-treasury/components/nfts-list/NFTsList.svelte';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';
	import Icon from '@iconify/svelte';

	export let NFTs: {
		[collectionIdentifier: string]: Nft[];
	};
	export let pageSize = 5;
	export let hasTitle = true;
</script>

{#if Object.values(NFTs).some((array) => array.length > 0)}
	<div class="column-3">
		{#if hasTitle}
			<span class="title">
				<Icon icon="tabler:hexagon" />
				NFT Treasury
			</span>
		{/if}
		<div class="card">
			<NFTsList {NFTs} {pageSize} />
		</div>
	</div>
{/if}

<style lang="scss">
	.title {
		font-size: var(--font-size-1);
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
	}
</style>
