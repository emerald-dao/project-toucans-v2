<script lang="ts">
	import IconCircle from '$components/atoms/IconCircle.svelte';

	const circlesAmount = 5;
	const baseCircleSize = 13;
	const circlesSizeIncrement = 9;
	const opacityIncrement = 0.22;
	const imagesAndIconsWidth = 3;

	const iconsAndPictures: IconsAndPictures[] = [
		{
			type: 'image',
			imageUrl: '/ec-logo.png',
			circleNumber: 0,
			alt: 'Emerald logo',
			position: 'left',
			speed: 'fast'
		},
		{
			type: 'image',
			imageUrl: 'flovatar-logo.jpg',
			circleNumber: 1,
			alt: 'Flovatar logo',
			position: 'right',
			speed: 'normal'
		},
		{
			type: 'image',
			imageUrl: 'ballerz-fc-logo.jpeg',
			circleNumber: 2,
			alt: 'Ballerz FC logo',
			position: 'left',
			speed: 'normal'
		},
		{
			type: 'image',
			imageUrl: 'sloppy-logo.jpeg',
			circleNumber: 3,
			alt: 'Sloppy logo',
			position: 'right',
			speed: 'fast'
		},
		{
			type: 'image',
			imageUrl: 'published-nft-logo.jpeg',
			circleNumber: 4,
			alt: 'Published NFT logo',
			position: 'right',
			speed: 'normal'
		}
	];

	interface IconsAndPictures {
		type: 'icon' | 'image';
		icon?: string;
		imageUrl?: string;
		circleNumber: number;
		alt?: string;
		position: 'left' | 'right';
		speed: 'normal' | 'fast';
	}
</script>

<div class="main-wrapper center">
	<div class="blur" />
	{#each Array(circlesAmount).fill(0) as circle, i}
		{#each iconsAndPictures as element}
			<div
				class="circle"
				class:rotate={element.speed === 'normal'}
				class:rotate-fast={element.speed === 'fast'}
				style={`width: ${
					baseCircleSize + i * circlesSizeIncrement
				}rem; border-width: 3px; border-style: dashed; border-color: color-mix(in srgb, var(--clr-neutral-badge), transparent ${
					i * opacityIncrement * 100
				}%);
				};`}
			>
				{#if element.circleNumber === i}
					{#if element.type === 'icon' && element.icon}
						<div
							class="icon-wrapper"
							class:rotation-inverse={element.speed === 'normal'}
							class:rotation-inverse-fast={element.speed === 'fast'}
							style={`${element.position}: -${imagesAndIconsWidth / 2}rem; `}
						>
							<IconCircle icon={element.icon} width={`${imagesAndIconsWidth / 2}rem`} />
						</div>
					{:else if element.type === 'image' && element.imageUrl}
						<img
							class:rotation-inverse={element.speed === 'normal'}
							class:rotation-inverse-fast={element.speed === 'fast'}
							src={element.imageUrl}
							style={`width: ${imagesAndIconsWidth}rem; ${element.position}: -${
								imagesAndIconsWidth / 2
							}rem;`}
							alt={element.alt}
						/>
					{/if}
				{/if}
			</div>
		{/each}
	{/each}
	<img src="/toucans-logo.png" alt="Toucans logo" style={`width: ${imagesAndIconsWidth}rem`} />
</div>

<style lang="scss">
	.main-wrapper {
		display: none;
		@include mq(medium) {
			display: flex;
		}
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
			display: flex;

			img,
			.icon-wrapper {
				position: absolute;
				top: 50%;
			}
		}

		img {
			aspect-ratio: 1/1;
			position: absolute;
			border-radius: 100%;
		}
	}

	.rotate {
		animation: rotation 15s linear infinite;
	}

	.rotation-inverse {
		animation: rotation-inverse 15s linear infinite;
	}

	.rotate-fast {
		animation: rotation 10s linear infinite;
	}

	.rotation-inverse-fast {
		animation: rotation-inverse 10s linear infinite;
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
