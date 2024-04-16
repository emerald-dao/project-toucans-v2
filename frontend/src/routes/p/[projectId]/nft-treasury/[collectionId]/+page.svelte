<script lang="ts">
	import { page } from '$app/stores';
	import NfTsList from '$lib/features/nft-treasury/components/nfts-list/NFTsList.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface.js';
	import { getContext } from 'svelte';

	export let data;

	const daoData: DAOProject = getContext('daoData');

	let pageSize = 8;
</script>

<NfTsList
	selectedCollection={$page.params.collectionId}
	NFTs={data.projectSpecificNFTTreasury}
	{pageSize}
	nftUuidOwnerMap={daoData.generalInfo.nftUuidOwnerMap}
	sortNFTs={true}
	nftTreasuryPage={true}
/>
