<script lang="ts">
	import { getContext } from 'svelte';
	import type { createSteps } from '$stores/custom/steps/Steps';
	import type { createActiveStep } from '$stores/custom/steps/ActiveStep';
	import type { daoGeneratorData as TdaoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
	import type { daoAndTokenGeneratorData } from '$lib/features/dao-generator/stores/DaoAndTokenGeneratorData';
	import { fly } from 'svelte/transition';
	import StepButtons from '../../atoms/StepButtons.svelte';
	import NftCollectionSelectCard from '$lib/features/nft-treasury/components/nft-collections-list/NFTCollectionSelectCard.svelte';
	import type { NftCollection } from '$lib/features/nft-treasury/types/nft-collection.interface';
	import Pagination from '$components/atoms/Pagination.svelte';
	import SearchBar from '$components/search-bar/SearchBar.svelte';

	const daoGeneratorData: typeof TdaoGeneratorData | typeof daoAndTokenGeneratorData =
		getContext('daoGeneratorData');
	const generatorActiveStep: ReturnType<typeof createActiveStep> =
		getContext('daoGeneratorActiveStep');
	const daoGeneratorSteps: ReturnType<typeof createSteps> = getContext('daoGeneratorSteps');

	const projectNFTs: {
		[collectionIdentifier: string]: NftCollection;
	} = getContext('projectNFTCatalog');

	let collectionsList = Object.values(projectNFTs);
	let filteredCollections = collectionsList;

	let pageStart: number;
	let pageEnd: number;

	$: currentPageCollections = filteredCollections.slice(pageStart, pageEnd);

	let selectedCollections: string[] = [];

	$: $daoGeneratorData.daoDetails.allowedNFTCollections = selectedCollections;
</script>

<form
	id={$daoGeneratorSteps[$generatorActiveStep].slug}
	on:submit|preventDefault={generatorActiveStep.increment}
	autocomplete="off"
	in:fly={{ y: 30, duration: 400 }}
>
	<div class="column-2">
		<label>NFT Collections</label>
		<p class="small">
			Select the collections from which you would like to receive NFTs. This can be edited later.
		</p>
	</div>
	<SearchBar
		items={collectionsList}
		bind:filteredItems={filteredCollections}
		searchTerms={['name', 'identifier']}
		placeholder="Search collections.."
	/>
	{#if filteredCollections.length > 0}
		<div class="collections-wrapper">
			{#each currentPageCollections as nftCollection (nftCollection.identifier)}
				<NftCollectionSelectCard {nftCollection} bind:selectedCollections />
			{/each}
		</div>
		<Pagination
			amountOfItems={filteredCollections.length}
			bind:pageStart
			bind:pageEnd
			pageSize={4}
		/>
	{:else}
		<span class="small">
			<em> No collections found. </em>
		</span>
	{/if}
	<StepButtons />
</form>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);

		.collections-wrapper {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(2, 1fr);
			gap: var(--space-3);
		}

		em {
			color: var(--clr-text-off);
		}
	}
</style>
