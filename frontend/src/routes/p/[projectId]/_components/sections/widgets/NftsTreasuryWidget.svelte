<script lang="ts">
	import { getProjectSpecificNFTTreasury } from '$flow/actions';
	import NFTsList from '$lib/features/nft-treasury/components/nfts-list/NFTsList.svelte';
	import CollectionSelector from '$lib/features/nft-treasury/components/nfts-list/atoms/CollectionSelector.svelte';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import Icon from '@iconify/svelte';
	import DownloadNftTreasury from '../../../../../admin/[projectId]/_components/stats-blocks/atoms/DownloadNFTTreasury.svelte';

	export let pageSize = 5;
	export let hasTitle = true;
	export let nftUuidOwnerMap = {};
	export let daoData: DAOProject;
	export let downloadable: boolean = false;

	const nftDefaults: { [projectId: string]: string } = {
		ADUToken: 'NFLAllDay',
		HOODLUMS: 'SturdyExchange'
	};

	let projectNFTsCollections = daoData.onChainData.allowedNFTCollections;
	let selectedCollection: string = nftDefaults[daoData.generalInfo.project_id]
		? projectNFTsCollections[
				Math.max(projectNFTsCollections.indexOf(nftDefaults[daoData.generalInfo.project_id]), 0)
		  ]
		: projectNFTsCollections[0];

	let storedUserNFTs: {
		[collectionIdentifier: string]: Nft[];
	} = {};

	async function fetchUserNFTs(collectionIdentifier: string) {
		console.log('Reloading!');

		if (!storedUserNFTs[collectionIdentifier]) {
			storedUserNFTs[collectionIdentifier] = await getProjectSpecificNFTTreasury(
				daoData.generalInfo.owner,
				daoData.generalInfo.project_id,
				collectionIdentifier
			);
		}
		return storedUserNFTs[collectionIdentifier];
	}
</script>

{#if projectNFTsCollections.length > 0}
	<div class="column-3">
		{#if hasTitle}
			<span class="title">
				<Icon icon="tabler:hexagon" />
				NFT Treasury
			</span>
		{/if}
		<div class="card">
			<div class="column-3">
				<CollectionSelector
					bind:selectedCollection
					collectionIdentifiers={projectNFTsCollections}
				/>
				{#await fetchUserNFTs(selectedCollection)}
					<span class="small"><i>Loading...</i></span>
				{:then userCatalogNFTs}
					<NFTsList
						{selectedCollection}
						NFTs={userCatalogNFTs}
						{pageSize}
						{nftUuidOwnerMap}
						sortNFTs={true}
					/>
					{#if downloadable}
						<DownloadNftTreasury
							events={daoData.events.filter((e) => e.type === 'DonateNFT').reverse()}
							projectId={daoData.generalInfo.project_id}
							NFTs={userCatalogNFTs}
							{selectedCollection}
						/>
					{/if}
				{/await}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.title {
		font-size: var(--font-size-1);
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
	}
</style>
