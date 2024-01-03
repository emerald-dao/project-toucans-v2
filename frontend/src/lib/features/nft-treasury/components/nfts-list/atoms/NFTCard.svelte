<script lang="ts">
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';

	export let nft: Nft;
	export let isSelected: boolean;
	export let clickable: boolean;
</script>

<div class="nft-wrapper" class:clickable class:selected={isSelected} on:click>
	<img src={nft.thumbnail} alt="NFT" />
	<p class="heading">{nft.name}</p>
</div>

<style lang="scss">
	.nft-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 1px solid var(--clr-border-primary);
		border-radius: var(--radius-2);
		padding: var(--space-4);
		gap: var(--space-3);
		text-align: center;
		background-color: var(--clr-surface-primary);

		.heading {
			font-size: var(--font-size-1);
		}

		img {
			border-radius: var(--radius-1);
			width: 60px;
			height: 60px;
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
