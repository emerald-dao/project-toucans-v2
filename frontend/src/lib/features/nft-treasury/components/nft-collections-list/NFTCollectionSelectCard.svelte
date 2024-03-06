<script lang="ts">
	import Image from '$components/Image.svelte';
	import type { NftCollection } from '$lib/features/nft-treasury/types/nft-collection.interface.js';

	export let nftCollection: NftCollection;
	export let selectedCollections: string[];
	export let isCollectionActive = false;
	export let singleCollectionSelect = false;

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

		if (singleCollectionSelect) {
			selectedCollections = [nftCollection.identifier];
		} else {
			selectedCollections = [...selectedCollections, nftCollection.identifier];
		}
	};

	let imgSrc = nftCollection.image ?? '/toucans-illustration.png';
</script>

<div
	class="card-wrapper"
	class:active={isCollectionActive}
	class:selected={isCollectionSelected}
	on:click={handleSelectCollection}
	on:keydown={handleSelectCollection}
>
	<div class="image-wrapper">
		<Image src={imgSrc} alt="collection" width="150px" height="100px" objectFit="contain" />
	</div>
	<div class="column-2 align-center">
		<p class="heading w-medium">{nftCollection.name}</p>
		<span class="xsmall">{nftCollection.identifier}</span>
	</div>
	<slot />
</div>

<style lang="scss">
	.card-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border: 1px solid var(--clr-border-primary);
		border-radius: var(--radius-2);
		padding: var(--space-4);
		gap: var(--space-3);
		text-align: center;
		cursor: pointer;
		position: relative;
		transition: all 0.1s ease-in-out;
		max-width: 100%;

		.image-wrapper {
			border-radius: var(--radius-2);
			overflow: hidden;
		}

		p,
		span {
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
			word-break: break-word;
		}

		&.active {
			border-color: var(--clr-heading-main);
			background-color: var(--clr-surface-primary);
			cursor: default;
		}

		&.selected {
			border-color: var(--clr-primary-main);
			background-color: var(--clr-surface-primary);
		}
	}
</style>
