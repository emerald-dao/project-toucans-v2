<script lang="ts">
	import NFTCollectionSelectedCard from '$lib/features/nft-treasury/components/nft-collections-list/NFTCollectionSelectedCard.svelte';
	import { fly } from 'svelte/transition';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface.js';
	import { Button } from '@emerald-dao/component-library';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { addAllowedNFTCollections } from './_actions/addAllowedNFTCollections.js';
	import NFTCollectionSelectCard from '$lib/features/nft-treasury/components/nft-collections-list/NFTCollectionSelectCard.svelte';
	import Pagination from '$lib/components/atoms/Pagination.svelte';

	export let data;

	const adminData: {
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	const userDaosStore = adminData.userDaos;

	$: activeDaoData = $userDaosStore[$activeDaoStore];

	let collectionsList = Object.values(data.projectNFTs);

	let pageStart: number;
	let pageEnd: number;

	$: currentPageCollections = collectionsList.slice(pageStart, pageEnd);

	let selectedCollections: string[] = [];
</script>

<div in:fly={{ x: 10, duration: 400 }}>
	<div class="introduction">
		<h5>NFT Treasury</h5>
		<p class="small">Please select the collections from which you would like to receive NFTs</p>
	</div>
	<div class="collections-wrapper">
		{#each currentPageCollections as collection (collection.identifier)}
			{#if activeDaoData.onChainData.allowedNFTCollections.includes(collection.identifier)}
				<NFTCollectionSelectedCard nftCollection={collection} bind:selectedCollections />
			{:else}
				<NFTCollectionSelectCard nftCollection={collection} bind:selectedCollections />
			{/if}
		{/each}
	</div>
	<div class="bottom-wrapper row-space-between">
		<Pagination amountOfItems={collectionsList.length} bind:pageStart bind:pageEnd />
		<Button
			state={selectedCollections.length === 0 ? 'disabled' : 'active'}
			on:click={() =>
				addAllowedNFTCollections(
					selectedCollections,
					activeDaoData.generalInfo.owner,
					activeDaoData.generalInfo.project_id
				)}
			>{`Add ${selectedCollections.length === 0 ? 'selected' : selectedCollections.length} ${
				selectedCollections.length === 1 ? 'collection' : 'collections'
			}`}</Button
		>
	</div>
</div>

<style lang="scss">
	.introduction {
		margin-bottom: var(--space-10);
		h5 {
			margin-bottom: var(--space-2);
			margin-top: 0;
		}
	}

	.collections-wrapper {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-10) var(--space-8);
	}

	.bottom-wrapper {
		margin-top: var(--space-10);
	}
</style>
