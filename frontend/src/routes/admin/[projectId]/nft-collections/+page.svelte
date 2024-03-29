<script lang="ts">
	import SearchBar from '$lib/components/search-bar/SearchBar.svelte';
	import NFTCollectionSelectedCard from '$lib/features/nft-treasury/components/nft-collections-list/NFTCollectionSelectedCard.svelte';
	import type {
		DAOProject,
		DaoDatabaseData
	} from '$lib/types/dao-project/dao-project.interface.js';
	import { Button } from '@emerald-dao/component-library';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { addAllowedNFTCollections } from './_actions/addAllowedNFTCollections.js';
	import NFTCollectionSelectCard from '$lib/features/nft-treasury/components/nft-collections-list/NFTCollectionSelectCard.svelte';
	import Pagination from '$lib/components/atoms/Pagination.svelte';
	import * as AdminPage from '../_components/admin-page';

	export let data;

	const adminData: {
		activeDao: Writable<DAOProject>;
		otherDaos: DaoDatabaseData[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	$: activeDaoData = $activeDaoStore;

	let collectionsList = Object.values(data.projectNFTs);
	let filteredCollections = collectionsList;

	let pageStart: number;
	let pageEnd: number;

	$: currentPageCollections = filteredCollections
		.sort((a, b) =>
			activeDaoData.onChainData.allowedNFTCollections.includes(a.identifier) ? -1 : 1
		)
		.slice(pageStart, pageEnd);

	let selectedCollections: string[] = [];
</script>

<AdminPage.Root>
	<AdminPage.Header>
		<AdminPage.Title>NFT Treasury</AdminPage.Title>
		<AdminPage.Description>
			Please select the collections from which you would like to receive NFTs.
		</AdminPage.Description>
	</AdminPage.Header>
	<AdminPage.Container grid={false}>
		<AdminPage.Content>
			<div class="content-wrapper">
				<div class="secondary-wrapper column-4 align-start">
					<SearchBar
						items={collectionsList}
						bind:filteredItems={filteredCollections}
						searchTerms={['name', 'identifier']}
						placeholder="Search collections..."
					/>
					{#if filteredCollections.length > 0}
						<div class="collections-wrapper">
							{#each currentPageCollections as collection (collection.identifier)}
								{#if activeDaoData.onChainData.allowedNFTCollections.includes(collection.identifier)}
									<NFTCollectionSelectedCard nftCollection={collection} bind:selectedCollections />
								{:else}
									<NFTCollectionSelectCard nftCollection={collection} bind:selectedCollections />
								{/if}
							{/each}
						</div>
						<Pagination
							amountOfItems={filteredCollections.length}
							bind:pageStart
							bind:pageEnd
							pageSize={8}
						/>
					{:else}
						<span class="small">
							<em> No collections found. </em>
						</span>
					{/if}
				</div>
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
		</AdminPage.Content>
	</AdminPage.Container>
</AdminPage.Root>

<style lang="scss">
	.collections-wrapper {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(2, 1fr);
		gap: var(--space-10) var(--space-8);
		width: 100%;
	}

	.content-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		justify-content: space-between;
		flex: 1;
		align-items: end;

		.secondary-wrapper {
			flex: 1;
			width: 100%;
		}

		em {
			color: var(--clr-text-off);
		}
	}
</style>
