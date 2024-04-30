<script lang="ts">
	import NfTsList from '$lib/features/nft-treasury/components/nfts-list/NFTsList.svelte';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import NBATopShotCollection from '$lib/features/nft-treasury/components/nfts-list/atoms/projects/NBATopShotCollection.svelte';
	import NFLAllDayCollection from '$lib/features/nft-treasury/components/nfts-list/atoms/projects/NFLAllDayCollection.svelte';

	export let nfts: Nft[];
	export let daoData: DAOProject;
	export let selectedCollection: string | null = null;

	let pageSize = 12;
</script>

<div
	class:sidebar={selectedCollection === 'NBATopShot' || selectedCollection === 'NFLAllDay'}
	class="main-wrapper column-6"
>
	{#if selectedCollection === 'NBATopShot'}
		<NBATopShotCollection bind:nfts bind:daoData />
	{:else if selectedCollection === 'NFLAllDay'}
		<NFLAllDayCollection bind:nfts bind:daoData />
	{:else}
		<NfTsList
			{selectedCollection}
			NFTs={nfts}
			{pageSize}
			nftUuidOwnerMap={daoData.generalInfo.nftUuidOwnerMap}
			sortNFTs={true}
			nftTreasuryPage={true}
		/>
	{/if}
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		width: 100%;
		flex: 1;
		justify-content: space-between;
	}

	.sidebar {
		display: grid;
		grid-template-columns: 1fr 2fr;

		@include mq('small') {
			grid-template-columns: 1.5fr 4fr;
		}

		@include mq('medium') {
			grid-template-columns: 0.8fr 4fr;
		}
	}
</style>
