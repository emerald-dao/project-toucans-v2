<script lang="ts">
	import { fly } from 'svelte/transition';
	import NftCollectionSelectCard from '$lib/features/nft-treasury/components/nft-collections-list/NFTCollectionSelectCard.svelte';
	import type { NftCollection } from '$lib/features/nft-treasury/types/nft-collection.interface';
	import Pagination from '$components/atoms/Pagination.svelte';
	import SearchBar from '$components/search-bar/SearchBar.svelte';
	import { getCatalogByCollectionIDs } from '$flow/actions';
	import { getContext } from 'svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import VotingNftModeCard from './atoms/VotingNftModeCard.svelte';
	import { VOTING_MODES } from '../../../../../../../lib/features/voting-rounds/constants/VOTING_MODES';
	import {
		votingGeneratorNftMode,
		votingGeneratorRequiredCollection
	} from '../../../_config/votingGeneratorData';

	const daoData = getContext<DAOProject>('activeDao');

	let collectionsList: NftCollection[] = [];
	let filteredCollections: NftCollection[] = [];

	const projectNFTs = getCatalogByCollectionIDs(daoData.onChainData.allowedNFTCollections).then(
		(collections) => {
			collectionsList = Object.values(collections);

			filteredCollections = collectionsList;
		}
	);

	let pageStart: number;
	let pageEnd: number;

	$: currentPageCollections = filteredCollections.slice(pageStart, pageEnd);

	$: $votingGeneratorNftMode === 'no-nfts' && ($votingGeneratorRequiredCollection = ['']);
</script>

<div class="column-5">
	<div class="options-wrapper">
		{#each Object.entries(VOTING_MODES) as [slug, { title, description }]}
			{#if !(slug === 'token-holders' && !daoData.hasToken)}
				<VotingNftModeCard
					{slug}
					{title}
					{description}
					bind:selectedSlug={$votingGeneratorNftMode}
				/>
			{/if}
		{/each}
	</div>
	{#if $votingGeneratorNftMode === 'nft-holders' || $votingGeneratorNftMode === 'nft-donators'}
		<div class="column-3">
			{#if daoData.onChainData.allowedNFTCollections.length === 0}
				<span class="small">
					<em> This DAO has no active NFT collections. </em>
				</span>
			{:else}
				{#await projectNFTs}
					<span class="small">
						<em> Searching collections... </em>
					</span>
				{:then}
					{#if collectionsList.length > 0}
						<div in:fly|locale={{ y: 20, duration: 200 }} class="collections-wrapper column-3">
							<div class="row-space-between row-4 align-center">
								<h4>Select NFT collection</h4>
								<SearchBar
									items={collectionsList}
									bind:filteredItems={filteredCollections}
									searchTerms={['name', 'identifier']}
									placeholder="Search collections.."
								/>
							</div>
							{#if currentPageCollections.length > 0}
								<div class="collections-grid">
									{#each currentPageCollections as nftCollection (nftCollection.identifier)}
										<NftCollectionSelectCard
											{nftCollection}
											bind:selectedCollections={$votingGeneratorRequiredCollection}
											singleCollectionSelect={true}
										/>
									{/each}
								</div>
							{:else}
								<span class="small">
									<em> No collections found </em>
								</span>
							{/if}
							<Pagination
								amountOfItems={filteredCollections.length}
								bind:pageStart
								bind:pageEnd
								pageSize={4}
							/>
						</div>
					{:else}
						<span class="small">
							<em> No collections found. </em>
						</span>
					{/if}
				{/await}
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.options-wrapper {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-4);
	}

	.collections-wrapper {
		background-color: var(--clr-background-primary);
		border: 1px solid var(--clr-border-primary);
		padding: var(--space-5);
		border-radius: var(--radius-4);

		h4 {
			font-size: var(--font-size-3);
		}

		.collections-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: var(--space-3);
		}
	}

	em {
		color: var(--clr-text-off);
	}
</style>
