<script lang="ts">
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';

	export let nft: Nft;
	let traits = nft.traits
		? nft.traits.reduce((obj, item) => Object.assign(obj, { [item.name]: item.value }), {})
		: {};
	let name = nft.traits ? traits['FullName'] : nft.name;
</script>

<div class="content-wrapper">
	<p class="w-medium heading">{name}</p>
	{#if nft.traits}
		<p class={`text`}>{traits['PlayType']}・{traits['SetName']}・{traits['SeriesNumber']}</p>
		<p class={`text`}>{traits['TeamAtMoment']}</p>
	{/if}
</div>

<style lang="scss">
	.content-wrapper {
		width: 100%;
		padding: var(--space-4) var(--space-2);
		border-top: 1px solid var(--clr-neutral-badge);
		display: flex;
		flex-direction: column;

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
