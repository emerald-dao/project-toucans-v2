<script lang="ts">
	import type { NftCollection } from '$lib/features/nft-treasury/types/nft-collection.interface.js';

	export let nftCollection: NftCollection;
	export let selectedCollections: string[];
	export let isCollectionActive = false;

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

	let profileImg = nftCollection.image ?? '/toucans-illustration.png';
</script>

<div
	class="card-wrapper"
	class:active={isCollectionActive}
	class:selected={isCollectionSelected}
	on:click={handleSelectCollection}
	on:keydown={handleSelectCollection}
>
	<div class="image-wrapper">
		<object data={profileImg} type="image/png">
			<img src="/flow-logo.png" alt="NFT" />
		</object>
	</div>
	<div class="column-2 align-center">
		<p class="heading w-medium">{nftCollection.identifier}</p>
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

		img,
		object,
		.image-wrapper {
			width: 150px;
			height: 100px;
			border-radius: var(--radius-2);
			object-fit: contain;
		}

		p {
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
