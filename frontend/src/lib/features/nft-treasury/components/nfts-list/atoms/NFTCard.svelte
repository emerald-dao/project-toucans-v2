<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';

	export let nft: Nft;
	export let isSelected: boolean;
	export let clickable: boolean;

	let imgSrc = nft.thumbnail.startsWith('ipfs://')
		? `https://nftstorage.link/ipfs/${nft.thumbnail.slice(7)}`
		: nft.thumbnail;
</script>

<div class="nft-wrapper" class:clickable class:selected={isSelected} on:click>
	{#if nft.serial}
		<div class="serial">
			<p class="w-medium">#{nft.serial}</p>
		</div>
	{/if}
	<div class="image-wrapper">
		<Image src={imgSrc} alt="NFT" width="100%" height="120px" />
	</div>
	<div class="content-wrapper">
		<p class="w-medium heading">{nft.name}</p>
	</div>
</div>

<style lang="scss">
	.nft-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 1px solid var(--clr-border-primary);
		border-radius: var(--radius-2);
		text-align: center;
		background-color: var(--clr-surface-primary);
		overflow: hidden;

		.content-wrapper {
			width: 100%;
			padding: var(--space-4) var(--space-2);
			border-top: 1px solid var(--clr-neutral-badge);

			.heading {
				font-size: var(--font-size-1);
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
				word-break: break-word;
			}
		}

		.serial {
			position: absolute;
			right: 0px;
			padding: 0px var(--space-2);
			background-color: var(--clr-surface-primary);
			border-radius: 0 0 0 var(--radius-1);
			border-bottom: 1px solid var(--clr-neutral-badge);
			border-left: 1px solid var(--clr-neutral-badge);

			p {
				font-size: 0.63rem;
			}
		}

		.image-wrapper {
			width: 100%;
			background-color: var(--clr-background-secondary);
		}

		&.clickable {
			cursor: pointer;
		}

		&.selected {
			border-color: var(--clr-heading-main);
			background-color: var(--clr-surface-secondary);
		}
	}
</style>
