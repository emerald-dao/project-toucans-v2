<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface.js';
	import { Button } from '@emerald-dao/component-library';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { addAllowedNFTCollections } from './_actions/addAllowedNFTCollections.js';
	import NftCollectionSelect from './_components/NFTCollectionSelect.svelte';
	import Pagination from './_components/Pagination.svelte';

	export let data;

	const adminData: {
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	const userDaosStore = adminData.userDaos;

	$: activeDaoData = $userDaosStore[$activeDaoStore];

	let nftsArray = Object.values(data.projectNFTs);

	let pageStart: number;
	let pageEnd: number;

	$: currentPageCollections = nftsArray.slice(pageStart, pageEnd);

	let selectedCollections: string[] = [];
</script>

<div in:fly={{ x: 10, duration: 400 }}>
	<div class="introduction">
		<h5>NFT Treasury</h5>
		<p class="small">Please select the collections from which you would like to receive NFTs</p>
	</div>
	<div class="nfts-wrapper">
		{#each currentPageCollections as collection (collection.identifier)}
			<NftCollectionSelect nftCollection={collection} bind:selectedCollections />
		{/each}
	</div>
	<div class="bottom-wrapper row-space-between">
		<Pagination amountOfItems={nftsArray.length} bind:pageStart bind:pageEnd />
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

	.nfts-wrapper {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-10) var(--space-8);
	}

	.bottom-wrapper {
		margin-top: var(--space-10);
	}
</style>
