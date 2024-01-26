<script lang="ts">
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';

	export let nft: Nft;
	let traits = nft.traits.reduce(
		(obj, item) => Object.assign(obj, { [item.name]: item.value }),
		{}
	);
	let name = traits['playerFirstName'] + ' ' + traits['playerLastName'];
	let tier = traits['editionTier'];
	let playType = traits['playType'];
	let set = traits['setName'];
	let series = traits['seriesName'];
	let team = traits['teamName'];
</script>

<div class="content-wrapper">
	<p class="w-medium heading">{name}</p>
	<p class={`text ${tier}`}>{tier.toUpperCase()}</p>
	<p class={`text`}>{playType}・{set}・{series}</p>
	<p class={`text`}>{team}</p>
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

		.legendary {
			color: transparent;
			background-clip: text;
			background-image: linear-gradient(to right, rgb(247, 167, 34), rgb(231, 251, 2));
		}

		.rare {
			color: transparent;
			background-clip: text;
			background-image: linear-gradient(to right, rgb(243, 78, 75), rgb(255, 143, 17));
		}

		.uncommon {
			color: transparent;
			background-clip: text;
			background-image: linear-gradient(to right, rgb(240, 242, 253), rgb(138, 148, 166));
		}

		.common {
			color: #fff;
			background-clip: text;
		}
	}
</style>
