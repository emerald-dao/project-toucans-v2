<script lang="ts">
	import { page } from '$app/stores';
	import NfTsList from '$lib/features/nft-treasury/components/nfts-list/NFTsList.svelte';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import NFTsTreasuryLayout from '../../_components/NFTsTreasuryLayout.svelte';
	import NBATopShotCollection from '$lib/features/nft-treasury/components/nfts-list/atoms/projects/NBATopShotCollection.svelte';
	import NFLAllDayCollection from '$lib/features/nft-treasury/components/nfts-list/atoms/projects/NFLAllDayCollection.svelte';

	export let nfts: Nft[];
	export let daoData: DAOProject;

	let pageSize = 12;
</script>

<NFTsTreasuryLayout data={daoData}>
	<div slot="nftsLength">
		{nfts.length} NFTs found
	</div>
	<div
		class:sidebar={$page.params.collectionId === 'NBATopShot' ||
			$page.params.collectionId === 'NFLAllDay'}
		class="column-6"
		slot="main"
	>
		{#if $page.params.collectionId === 'NBATopShot'}
			<NBATopShotCollection bind:nfts bind:daoData />
		{:else if $page.params.collectionId === 'NFLAllDay'}
			<NFLAllDayCollection bind:nfts bind:daoData />
		{:else}
			<NfTsList
				selectedCollection={$page.params.collectionId}
				NFTs={nfts}
				{pageSize}
				nftUuidOwnerMap={daoData.generalInfo.nftUuidOwnerMap}
				sortNFTs={true}
				nftTreasuryPage={true}
			/>
		{/if}
	</div>
</NFTsTreasuryLayout>

<style lang="scss">
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
