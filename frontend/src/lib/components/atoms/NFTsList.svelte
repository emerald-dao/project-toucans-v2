<script lang="ts">
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	export let NFTs: {
		[collectionIdentifier: string]: {
			id: string;
			name: string;
			thumbnail: string;
		}[];
	};
	export let pageSize: number;
	export let userNFTs = false;
	export let clickable = false;
	export let selectedCollection = '';

	let selectedNFTs: {
		id: string;
		name: string;
		thumbnail: string;
	}[] = [];

	export let selectedNFTIds: string[] = [];

	let collectionTypes = userNFTs
		? Object.keys(NFTs)
		: Array.from(new Set(Object.keys(NFTs).map((key) => key.split('.')[2])));

	onMount(async () => {
		selectedCollection = collectionTypes[0];
		updateSelectedNFTs();
	});

	function handleCollectionChange<T extends Event>(event: T) {
		const target = event.target as HTMLSelectElement;
		selectedCollection = target.value;
		updateSelectedNFTs();
	}

	function updateSelectedNFTs() {
		selectedNFTIds = [];
		if (userNFTs) {
			selectedNFTs = NFTs[selectedCollection] || [];
		} else {
			const keyPrefix = Object.keys(NFTs).find((key) =>
				key.endsWith(`.${selectedCollection}.Collection`)
			);
			selectedNFTs = keyPrefix ? NFTs[keyPrefix] : [];
		}
	}

	function handleNFTClick(nftId: string) {
		if (!clickable) {
			return;
		}
		const index = selectedNFTIds.indexOf(nftId);
		if (index === -1) {
			selectedNFTIds = [...selectedNFTIds, nftId];
		} else {
			selectedNFTIds = selectedNFTIds.filter((id) => id !== nftId);
		}
	}

	let currentPage = 1;
	const nextPage = () => {
		currentPage += 1;
	};
	const prevPage = () => {
		currentPage -= 1;
	};
	$: pageStart = (currentPage - 1) * pageSize;
	$: pageEnd = pageStart + pageSize;
	$: currentPageNFTs = selectedNFTs.slice(pageStart, pageEnd);
</script>

<div class="column-3">
	<select bind:value={selectedCollection} on:change={handleCollectionChange}>
		<option value="" disabled selected hidden>Select one collection...</option>
		{#each collectionTypes as collection}
			<option value={collection}>{collection}</option>
		{/each}
	</select>
	{#if currentPageNFTs.length === 0}
		<p class="heading" style="padding: var(--space-3) 0;">Sorry! No NFTs from this collection</p>
	{/if}
	{#each currentPageNFTs as nft (nft.id)}
		<div
			class="nfts-wrapper"
			class:clickable
			class:selected={selectedNFTIds.includes(nft.id)}
			on:click={() => handleNFTClick(nft.id)}
		>
			<img src={nft.thumbnail} alt="NFT" />
			<div class="column-1">
				<p class="heading">{nft.name}</p>
			</div>
		</div>
	{/each}
</div>
<div class="pagination row-space-between">
	<div class="row-4">
		<button
			style={currentPage === 1 ? `color:var(--clr-heading-off)` : `color:var(--clr-heading-main)`}
			on:click={prevPage}
			disabled={currentPage === 1 ? true : false}
			type="button"
		>
			<Icon icon="tabler:arrow-left" />
		</button>
		<div>
			<button
				style={pageEnd >= selectedNFTs.length
					? `color:var(--clr-heading-off)`
					: `color:var(--clr-heading-main)`}
				on:click={nextPage}
				disabled={pageEnd >= selectedNFTs.length ? true : false}
				type="button"
			>
				<Icon icon="tabler:arrow-right" />
			</button>
		</div>
	</div>
</div>

<style lang="scss">
	select {
		background-color: var(--clr-surface-primary);
	}

	.nfts-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		border: 1px solid var(--clr-border-primary);
		border-radius: var(--radius-4);
		padding: var(--space-3) 0 var(--space-3) var(--space-2);
		gap: var(--space-7);
		background-color: var(--clr-surface-primary);

		img {
			border-radius: 50%;
			width: 60px;
			height: 60px;
			object-fit: cover;
		}

		&.clickable {
			cursor: pointer;
		}

		&.selected {
			background-color: var(--clr-primary-600);
		}
	}

	.pagination {
		margin: var(--space-4) 0;

		button {
			background: none;
			border: none;
			box-shadow: none;
			outline: none;
			cursor: pointer;

			&:disabled {
				cursor: not-allowed;
			}
		}
	}
</style>
