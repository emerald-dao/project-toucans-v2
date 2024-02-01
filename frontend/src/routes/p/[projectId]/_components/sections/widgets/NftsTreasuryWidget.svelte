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

	let projectNFTsCollections = daoData.onChainData.allowedNFTCollections;
	let selectedCollection: string = projectNFTsCollections[0];

	let storedUserNFTs: {
		[collectionIdentifier: string]: Nft[];
	} = {};
	let userNFTs: Promise<Nft[]>;

	fetchUserNFTs();
	async function fetchUserNFTs() {
		userNFTs = new Promise(async (resolve, reject) => {
			if (!storedUserNFTs[selectedCollection]) {
				storedUserNFTs[selectedCollection] = await getProjectSpecificNFTTreasury(
					daoData.generalInfo.owner,
					daoData.generalInfo.project_id,
					selectedCollection
				);
			}
			resolve(storedUserNFTs[selectedCollection]);
		});
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
					on:collectionChange={fetchUserNFTs}
				/>
				{#await userNFTs}
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
