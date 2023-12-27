<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface.js';
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { addAllowedNFTCollections } from './_actions/addAllowedNFTCollections.js';
	import { removeAllowedNFTCollections } from './_actions/removeAllowedNFTCollections.js';

	export let data;

	const adminData: {
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	const userDaosStore = adminData.userDaos;

	$: activeDaoData = $userDaosStore[$activeDaoStore];

	let nftsArray = Object.values(data.projectNFTs);

	export let pageSize = 6;
	let currentPage = 1;
	const nextPage = () => {
		currentPage += 1;
	};
	const prevPage = () => {
		currentPage -= 1;
	};
	$: pageStart = (currentPage - 1) * pageSize;
	$: pageEnd = pageStart + pageSize;

	$: currentPageNFTs = nftsArray.slice(pageStart, pageEnd);

	let selectedNFTs: string[] = [];

	function handleNFTClick(index: string) {
		if (selectedNFTs.includes(index)) {
			selectedNFTs = selectedNFTs.filter((item) => item !== index);
		} else {
			selectedNFTs = [...selectedNFTs, index];
		}
	}
</script>

<div class="introduction">
	<h5>NFT Treasury</h5>
	<p class="small">{`Please select the collections from which you would like to receive NFTs`}</p>
</div>
<div class="nfts-wrapper">
	{#each currentPageNFTs as NFT, i}
		<div
			class="card-wrapper"
			class:already-selected={activeDaoData.onChainData.allowedNFTCollections.includes(
				NFT.identifier
			)}
			class:selected={selectedNFTs.includes(NFT.identifier)}
			on:click={activeDaoData.onChainData.allowedNFTCollections.includes(NFT.identifier)
				? () => {}
				: () => handleNFTClick(NFT.identifier)}
		>
			{#if activeDaoData.onChainData.allowedNFTCollections.includes(NFT.identifier)}
				<div
					class="remove-icon"
					data-tooltip="Remove"
					on:click={() =>
						removeAllowedNFTCollections(
							[NFT.identifier],
							activeDaoData.generalInfo.owner,
							activeDaoData.generalInfo.project_id
						)}
				>
					<Icon icon="tabler:x" width="20" height="20" />
				</div>
			{/if}
			<img src={NFT.image} alt="NFT" />
			<p class="heading">{NFT.identifier}</p>
			<span class="small">{NFT.name}</span>
		</div>
	{/each}
</div>
<div class="pagination row-space-between">
	<div class="row-4">
		<Button
			on:click={prevPage}
			state={currentPage === 1 ? 'disabled' : 'active'}
			type="transparent"
			color="neutral"
		>
			<Icon icon="tabler:arrow-left" />
		</Button>
		<Button
			on:click={nextPage}
			state={pageEnd >= nftsArray.length ? 'disabled' : 'active'}
			type="transparent"
			color="neutral"
		>
			<Icon icon="tabler:arrow-right" />
		</Button>
	</div>
	<Button
		on:click={() =>
			addAllowedNFTCollections(
				selectedNFTs,
				activeDaoData.generalInfo.owner,
				activeDaoData.generalInfo.project_id
			)}>Add selected collections</Button
	>
</div>

<style lang="scss">
	.introduction {
		margin-bottom: var(--space-10);
		h5 {
			margin-bottom: var(--space-2);
			margin-top: 0;
		}
	}
	.nfts-wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: var(--space-10) var(--space-8);

		.card-wrapper {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			border: 1px solid var(--clr-border-primary);
			border-radius: var(--radius-4);
			padding: var(--space-6) 0;
			gap: var(--space-4);
			text-align: center;
			cursor: pointer;
			position: relative;

			img {
				border-radius: 50%;
				width: 100px;
				height: 100px;
			}

			.remove-icon {
				position: absolute;
				top: 8px;
				right: 8px;
			}

			&.already-selected {
				background-color: var(--clr-primary-900);
				border: var(--clr-border-secondary) 3px solid;
			}

			&.selected {
				background-color: var(--clr-primary-600);
			}
		}
	}
	.pagination {
		margin-top: var(--space-10);
	}
</style>
