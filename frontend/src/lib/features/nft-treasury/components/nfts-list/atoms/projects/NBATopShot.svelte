<script lang="ts">
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';

	export let nft: Nft;
	let name = nft.traits ? nft.traits['FullName'] : nft.name;
</script>

<div class="content-wrapper">
	<p class="w-medium heading">{name}</p>
	{#if nft.traits}
		<p class={`text`}>
			{nft.traits['PlayType']}・{nft.traits['SetName']}・{nft.traits['SeriesNumber']}
		</p>
		<p class={`text`}>{nft.traits['TeamAtMoment']}</p>
	{/if}
</div>

<style lang="scss">
	.content-wrapper {
		width: 100%;
		padding: var(--space-4) var(--space-2);
		border-top: 1px solid var(--clr-neutral-badge);
		display: flex;
		flex-direction: column;
		flex-grow: 1;

		.heading {
			text-align: left;
			font-size: var(--font-size-2);
		}

		.text {
			text-align: left;
			font-size: var(--font-size-0);
		}
	}
</style>
