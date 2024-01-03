<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface.js';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { removeAllowedNFTCollections } from '../_actions/removeAllowedNFTCollections.js';
	import type { NftCollection } from '$lib/types/common/nft-collection.interface.js';

	export let nftCollection: NftCollection;
	export let selectedCollections: string[];

	const adminData: {
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	const userDaosStore = adminData.userDaos;

	$: activeDaoData = $userDaosStore[$activeDaoStore];

	$: isCollectionActive = activeDaoData.onChainData.allowedNFTCollections.includes(
		nftCollection.identifier
	);
	$: isCollectionSelected = selectedCollections.includes(nftCollection.identifier);

	const handleSelectCollection = () => {
		if (isCollectionActive) {
			return;
		}

		if (isCollectionSelected) {
			selectedCollections = selectedCollections.filter(
				(collection) => collection !== nftCollection.identifier
			);
			return;
		}

		selectedCollections = [...selectedCollections, nftCollection.identifier];
	};
</script>

<div
	class="card-wrapper"
	class:already-selected={isCollectionActive}
	class:selected={isCollectionSelected}
	on:click={handleSelectCollection}
	on:keydown={handleSelectCollection}
>
	{#if isCollectionActive}
		<div
			class="remove-icon"
			data-tooltip="Remove"
			on:click={() =>
				removeAllowedNFTCollections(
					[nftCollection.identifier],
					activeDaoData.generalInfo.owner,
					activeDaoData.generalInfo.project_id
				)}
			on:keydown={() =>
				removeAllowedNFTCollections(
					[nftCollection.identifier],
					activeDaoData.generalInfo.owner,
					activeDaoData.generalInfo.project_id
				)}
		>
			<Icon icon="tabler:x" width="20" height="20" />
		</div>
	{/if}
	<img src={nftCollection.image} alt="NFT" />
	<p class="heading">{nftCollection.identifier}</p>
	<span class="small">{nftCollection.name}</span>
</div>

<style lang="scss">
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
			border-color: var(--clr-primary-main);
			background-color: var(--clr-surface-primary);
		}

		&.selected {
			border-color: var(--clr-heading-main);
			background-color: var(--clr-surface-primary);
		}
	}
</style>
