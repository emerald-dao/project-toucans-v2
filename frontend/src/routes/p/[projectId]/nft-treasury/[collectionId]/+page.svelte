<script lang="ts">
	import NFTsTreasuryError from './../_components/NFTsTreasuryError.svelte';
	import NFTsTreasuryLoadingSpinner from '../_components/NFTsTreasuryLoadingSpinner.svelte';
	import { page } from '$app/stores';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface.js';
	import { getContext } from 'svelte';
	import { getProjectSpecificNFTs } from './_functions/getProjectSpecificNFTs.js';
	import NFTsTreasuryCollection from '../_components/NFTsTreasuryCollection.svelte';
	import { amountOfNfts } from '../_store/amountOfNfts';

	export let data: DAOProject;

	const daoData: DAOProject = getContext('daoData');

	async function getCollectionNfts(collection: string) {
		$amountOfNfts = 'loading';

		const nfts = await getProjectSpecificNFTs(
			data.generalInfo.owner,
			data.generalInfo.project_id,
			collection
		);

		$amountOfNfts = nfts.length;

		return nfts;
	}
</script>

{#await getCollectionNfts($page.params.collectionId)}
	<NFTsTreasuryLoadingSpinner />
{:then nfts}
	<NFTsTreasuryCollection {daoData} {nfts} selectedCollection={$page.params.collectionId} />
{:catch}
	<NFTsTreasuryError />
{/await}
