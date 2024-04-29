<script lang="ts">
	import { page } from '$app/stores';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';
	import { onDestroy, onMount } from 'svelte';
	import NfTsList from '../../NFTsList.svelte';
	import { createSearchStore, searchHandler } from '$components/search-bar/searchStore';
	import CollectionFilters from '../../../../../../../routes/p/[projectId]/nft-treasury/[collectionId]/_components/CollectionFilters.svelte';
	import type { NBAFilter } from '$lib/features/nft-treasury/types/NBATopShot/nba-filter-interface';
	import { createNBAFilters } from '$lib/features/nft-treasury/functions/NBATopShot/NBATopShotFilters';
	import { filterNBAContent } from '$lib/features/nft-treasury/functions/NBATopShot/NBATopShotContentFilter';
	import { derived } from 'svelte/store';
	import { createSearchTerms } from '$lib/features/nft-treasury/functions/createSearchTerms';

	export let nfts: Nft[];
	export let daoData: DAOProject;

	let pageSize = 12;
	let filters: NBAFilter[] = [];

	let activeFilters = {
		numberOneSerial: true,
		seriesNumber: true,
		playCategory: true,
		tier: false
	};

	onMount(() => {
		filters = createNBAFilters(activeFilters);
	});

	$: terms = createSearchTerms(nfts, true);

	$: searchByNameStore = createSearchStore(terms.searchByName);
	$: searchByTeamNameStore = createSearchStore(terms.searchByTeam);
	$: searchBySetNameStore = createSearchStore(terms.searchBySetName);

	$: unsubscribeName = searchByNameStore.subscribe((model) => searchHandler(model));
	$: unsubscribeTeam = searchByTeamNameStore.subscribe((model) => searchHandler(model));
	$: unsubscribeSet = searchBySetNameStore.subscribe((model) => searchHandler(model));

	onDestroy(() => {
		unsubscribeName();
		unsubscribeTeam();
		unsubscribeSet();
	});

	let filteredContent: Promise<Nft[]> | Nft[];

	function createCombinedSearchStore() {
		const storeList = [searchByNameStore, searchByTeamNameStore, searchBySetNameStore];

		const combinedSearchStore = derived(storeList, (stores) => {
			const filteredStores = stores.filter((store) => store.search.length > 0);
			const filteredArrays = filteredStores.map((store) => store.filtered.map((item) => item.uuid));

			let intersectedUuids: string[];

			if (filteredArrays.length === 3) {
				intersectedUuids = filteredArrays.reduce((acc, cur) =>
					acc.filter((uuid) => cur.includes(uuid))
				);
			} else if (filteredArrays.length === 2) {
				intersectedUuids = filteredArrays[0];
				for (let i = 1; i < filteredArrays.length; i++) {
					intersectedUuids = intersectedUuids.filter((uuid) => filteredArrays[i].includes(uuid));
				}
			}

			let result;

			if (filteredStores.length > 1) {
				result = filteredStores[0].filtered.filter((item) => intersectedUuids.includes(item.uuid));
			} else if (filteredStores.length === 1) {
				result = filteredStores[0].filtered;
			} else {
				result = nfts;
			}

			filteredContent = filterNBAContent(filters, result, activeFilters);
		});

		const unsubscribe = combinedSearchStore.subscribe(() => {});

		onDestroy(() => unsubscribe());
	}

	$: if (
		filters.length > 0 &&
		($searchByNameStore.search.length > 0 ||
			$searchByTeamNameStore.search.length > 0 ||
			$searchBySetNameStore.search.length)
	) {
		createCombinedSearchStore();
	} else if (filters.length > 0) {
		filteredContent = filterNBAContent(filters, nfts, activeFilters);
	} else {
		filteredContent = nfts;
	}
</script>

<div class="column-4">
	<div>
		<h5>Player Name</h5>
		<input type="text" placeholder="Search NFT by player" bind:value={$searchByNameStore.search} />
	</div>
	<div>
		<h5>Team at Moment</h5>
		<input
			type="text"
			placeholder="Search NFT by team"
			bind:value={$searchByTeamNameStore.search}
		/>
	</div>
	<div>
		<h5>Set Name</h5>
		<input
			type="text"
			placeholder="Search NFT by set name"
			bind:value={$searchBySetNameStore.search}
		/>
	</div>
	<CollectionFilters bind:filters />
</div>
<div class="column-6">
	{#await filteredContent then contents}
		<NfTsList
			selectedCollection={$page.params.collectionId}
			NFTs={contents}
			{pageSize}
			nftUuidOwnerMap={daoData.generalInfo.nftUuidOwnerMap}
			sortNFTs={true}
			nftTreasuryPage={true}
		/>
	{/await}
</div>

<style lang="scss">
	h5 {
		margin-bottom: var(--space-2);
		font-size: var(--font-size-3);
		margin-top: 0;
	}
</style>
