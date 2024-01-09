<script lang="ts">
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';

	export let nft: Nft;
	export let isSelected: boolean;
	export let clickable: boolean;
</script>

<div class="nft-wrapper" class:clickable class:selected={isSelected} on:click>
	<img src={nft.thumbnail} alt="NFT" />
	<div class="content-wrapper">
		<p class="heading">{nft.name}</p>
	</div>
</div>

<style lang="scss">
	.nft-wrapper {
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

		img {
			width: 100%;
			height: 120px;
			object-fit: cover;
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
