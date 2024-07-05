<script lang="ts">
	import UserAvatar from '$components/atoms/user/UserAvatar.svelte';
	import Image from '$lib/components/Image.svelte';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';
	import Icon from '@iconify/svelte';
	import NFTCardDetails from './NFTCardDetails.svelte';
	import NBATopShot from './projects/NBATopShot.svelte';
	import NFLAllDay from './projects/NFLAllDay.svelte';

	export let nft: Nft;
	export let isSelected: boolean;
	export let clickable: boolean;
	export let selectedCollection: string;
	export let donatedBy: string | undefined;

	let imgSrc = nft.thumbnail.startsWith('ipfs://')
		? `https://ipfs.io/ipfs/${nft.thumbnail.slice(7)}`
		: nft.thumbnail;

	let cardDetailComponents = {
		NFLAllDay: NFLAllDay,
		NBATopShot: NBATopShot
	};
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
	<svelte:component
		this={cardDetailComponents[selectedCollection] || NFTCardDetails}
		{nft}
		{donatedBy}
	/>
	{#if donatedBy}
		<div class="donated-by">
			<p class="xsmall">
				<!-- <Icon icon="tabler:gift" /> -->
				Donated by
			</p>
			<UserAvatar
				address={donatedBy}
				imageSize="33px"
				userLink={false}
				fontSize="var(--font-size-0)"
			/>
		</div>
	{/if}
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

		.donated-by {
			width: 100%;
			padding: var(--space-1) var(--space-2);
			p {
				font-style: italic;
				display: flex;
				justify-content: left;
				align-items: center;
				gap: var(--space-1);
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
