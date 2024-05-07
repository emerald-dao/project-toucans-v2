<script lang="ts">
	import Pagination from '$components/atoms/Pagination.svelte';
	import { getProjectNFTTreasury } from '$flow/actions.js';
	import NftCard from '$lib/features/nft-treasury/components/nfts-list/atoms/NFTCard.svelte';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface.js';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface.js';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import NFTsTreasuryLayout from './_components/NFTsTreasuryLayout.svelte';

	export let data: DAOProject;

	const daoData: DAOProject = getContext('daoData');

	let pageSize = 12;
	let pageStart: number;
	let pageEnd: number;

	let projectNFTTreasury: {
		[collectionIdentifier: string]: Nft[];
	};
	let amountOfNFTs: number;

	async function getProjectNFTs() {
		projectNFTTreasury = await getProjectNFTTreasury(
			data.generalInfo.owner,
			data.generalInfo.project_id
		);

		amountOfNFTs = Object.entries(projectNFTTreasury).flatMap(([identifier, nfts]) =>
			nfts.map((nft) => ({ nft, identifier }))
		).length;

		return projectNFTTreasury;
	}
</script>

{#await getProjectNFTs()}
	<NFTsTreasuryLayout {data}>
		<div slot="nftsLength">... NFTs found</div>
		<div class="row-2" slot="main">
			<Icon icon="svg-spinners:ring-resize" width="1.2rem" />
			<span><i>Loading {data.generalInfo.name} NFTs Treasury...</i></span>
		</div>
	</NFTsTreasuryLayout>
{:then projectNFTTreasury}
	<NFTsTreasuryLayout {data}>
		<div slot="nftsLength">
			{amountOfNFTs} NFTs found
		</div>
		<div class="main-wrapper" slot="main">
			<div class="nfts-container">
				{#each Object.entries(projectNFTTreasury)
					.flatMap(([identifier, nfts]) => nfts.map((nft) => ({ nft, identifier })))
					.slice(pageStart, pageEnd) as nftObject (nftObject.nft.id)}
					<NftCard
						nft={nftObject.nft}
						clickable={false}
						isSelected={false}
						selectedCollection={nftObject.identifier}
						donatedBy={daoData.generalInfo.nftUuidOwnerMap[nftObject.nft.uuid]}
						nftTreasuryPage={true}
					/>
				{/each}
			</div>

			<Pagination
				bind:pageStart
				bind:pageEnd
				amountOfItems={amountOfNFTs}
				{pageSize}
				scrollToTopOnChange={true}
			/>
		</div>
	</NFTsTreasuryLayout>
{:catch error}
	<NFTsTreasuryLayout {data}>
		<div slot="main">
			<span><i>Error loading comments: {error.message}</i></span>
		</div>
	</NFTsTreasuryLayout>
{/await}

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		.nfts-container {
			display: grid;
			grid-template-columns: repeat(1, 1fr);
			gap: var(--space-4);

			@include mq('small') {
				grid-template-columns: repeat(2, 1fr);
			}

			@include mq('medium') {
				grid-template-columns: repeat(4, 1fr);
			}
		}
	}
</style>
