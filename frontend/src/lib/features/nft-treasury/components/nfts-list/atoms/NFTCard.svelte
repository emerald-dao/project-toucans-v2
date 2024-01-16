<script lang="ts">
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';

	export let nft: Nft;
	export let isSelected: boolean;
	export let clickable: boolean;

	let imgUrl = nft.thumbnail.startsWith('ipfs://')
		? `https://nftstorage.link/ipfs/${nft.thumbnail.slice(7)}`
		: nft.thumbnail;
</script>

<div class="nft-wrapper" class:clickable class:selected={isSelected} on:click>
	{#if nft.serial}
		<div class="serial">
			<p class="xsmall">#{nft.serial}</p>
		</div>
	{/if}
	<object data={imgUrl} type="image/png">
		<img src="/toucans-illustration.png" alt="NFT" />
	</object>
	<div class="content-wrapper">
		<p class="heading">{nft.name}</p>
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
			padding: var(--space-4) var(--space-2);

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
			padding: var(--space-1);
			background-color: var(--clr-surface-primary);
			border-radius: 0 var(--radius-2) 0 var(--radius-1);
		}

		img,
		object {
			width: 100%;
			height: 120px;
			object-fit: cover;
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
