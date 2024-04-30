<script lang="ts">
	import NFTsTreasuryError from './_components/NFTsTreasuryError.svelte';
	import NFTsTreasuryCollection from './_components/NFTsTreasuryCollection.svelte';
	import { getProjectNFTTreasury } from '$flow/actions.js';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface.js';
	import { getContext } from 'svelte';
	import NfTsTreasuryLoadingSpinner from './_components/NFTsTreasuryLoadingSpinner.svelte';
	import { amountOfNfts } from './_store/amountOfNfts';

	export let data: DAOProject;

	const daoData: DAOProject = getContext('daoData');

	async function getProjectNFTs() {
		$amountOfNfts = 'loading';

		const projectNFTTreasury = await getProjectNFTTreasury(
			data.generalInfo.owner,
			data.generalInfo.project_id
		);

		const nfts = Object.entries(projectNFTTreasury).flatMap(([identifier, nfts]) =>
			nfts.map((nft) => ({ ...nft, collectionId: identifier }))
		);

		$amountOfNfts = nfts.length;

		return nfts;
	}
</script>

{#await getProjectNFTs()}
	<NfTsTreasuryLoadingSpinner />
{:then nfts}
	<NFTsTreasuryCollection {nfts} {daoData} />
{:catch}
	<NFTsTreasuryError />
{/await}
