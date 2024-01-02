<script lang="ts">
	import ChartSvg from './atoms/ChartSvg.svelte';
	import CommunityType from '../atoms/CommunityType.svelte';

	let names = [
		'Gaming communities',
		'NFT Collectors',
		'Meme Coins',
		'Open Source Projects',
		'Educational communities',
		'Whatever you can imagine!'
	];

	let icons = [
		'noto:video-game',
		'emojione-v1:octopus',
		'twemoji:see-no-evil-monkey',
		'noto:laptop-computer',
		'noto:graduation-cap',
		'noto:light-bulb'
	];
</script>

<div class="section-large">
	<div class="container column-10 align-center">
		<ChartSvg />
		<div class="column-7">
			<h2 class="w-medium">
				Any community can
				<span> unlock it's potential </span>
			</h2>
			<p>Unlock transparent funding and governance on the Flow Blockchain.</p>
		</div>
		<div class="badges-wrapper">
			{#each names as name, i}
				<CommunityType {name} icon={icons[i]} />
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.section-large {
		overflow: hidden;
		background-color: var(--clr-background-secondary);
		border-block: 1px solid var(--clr-neutral-badge);

		.container {
			text-align: center;
			position: relative;

			h2 {
				font-size: var(--font-size-9);

				span {
					display: block;
					white-space: nowrap;
					background: -webkit-linear-gradient(
						var(--clr-background-primary),
						var(--clr-heading-main)
					);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}
			}

			p {
				font-size: var(--font-size-4);
			}

			.badges-wrapper {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				justify-content: center;
				gap: var(--space-4);
				z-index: 1;
			}
		}
	}
</style>
