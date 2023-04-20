<script lang="ts">
	import IconCircle from '$components/atoms/IconCircle.svelte';

	const circlesAmount = 10;
	const baseCircleSize = 10;
	const circlesSizeIncrement = 10;
	const opacityIncrement = 0.1;
	const imagesAndIconsWidth = 3;

	const iconsAndPictures: IconsAndPictures[] = [
		{
			type: 'image',
			imageUrl: '/toucans-logo.svg',
			circleNumber: 1,
			alt: 'Toucans logo',
			position: 'right'
		},
		{
			type: 'image',
			imageUrl: '/ec-logo.png',
			circleNumber: 2,
			alt: 'Emerald logo',
			position: 'left'
		}
	];

	interface IconsAndPictures {
		type: 'icon' | 'image';
		icon?: string;
		imageUrl?: string;
		circleNumber: number;
		alt?: string;
		position: 'left' | 'right';
	}
</script>

<div class="main-wrapper center">
	<div class="blur" />
	{#each Array(circlesAmount).fill(0) as circle, i}
		<div
			class="circle rotation"
			style={`width: ${baseCircleSize + i * circlesSizeIncrement}rem; opacity: ${
				1 - i * opacityIncrement
			};`}
		>
			{#each iconsAndPictures as element}
				{#if element.circleNumber === i}
					{#if element.type === 'icon' && element.icon}
						<div
							class="icon-wrapper rotation-inverse"
							style={`${element.position}: -${imagesAndIconsWidth / 2}rem; `}
						>
							<IconCircle icon={element.icon} width={`${imagesAndIconsWidth / 2}rem`} />
						</div>
					{:else if element.type === 'image' && element.imageUrl}
						<img
							class="rotation-inverse"
							src={element.imageUrl}
							style={`width: ${imagesAndIconsWidth}rem; ${element.position}: -${
								imagesAndIconsWidth / 2
							}rem`}
							alt={element.alt}
						/>
					{/if}
				{/if}
			{/each}
		</div>
	{/each}
	<img
		class="flow-logo"
		src="/flow-logo.png"
		alt="Flow logo"
		style={`width: ${imagesAndIconsWidth}rem`}
	/>
</div>

<style lang="scss">
	.main-wrapper {
		flex: 1;
		position: relative;

		.blur,
		.circle {
			position: absolute;
			border-radius: 50%;
			z-index: -1;
			aspect-ratio: 1/1;
		}

		.blur {
			width: 15rem;
			background: var(--clr-tertiary-main);
			filter: blur(6rem);
			opacity: 0.2;
		}

		.circle {
			border: 3px dashed var(--clr-neutral-badge);
			display: flex;

			img,
			.icon-wrapper {
				position: absolute;
				top: 50%;
			}

			.rotation-inverse {
				animation: rotation-inverse 15s linear infinite;
			}

			&.rotation {
				animation: rotation 15s linear infinite;
			}
		}

		img {
			aspect-ratio: 1/1;
			position: absolute;
		}
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes rotation-inverse {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(-360deg);
		}
	}
</style>
