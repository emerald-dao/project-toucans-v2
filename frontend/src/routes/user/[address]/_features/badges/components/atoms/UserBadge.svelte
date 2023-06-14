<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { Level } from '../../badges.interfaces';
	import Icon from '@iconify/svelte';

	export let badgeLevel: Level;

	let hover = false;
</script>

<div class="column-1 align-center main-wrapper">
	<img
		src="/avatar-2.png"
		alt="Badge"
		on:mouseenter={() => (hover = true)}
		on:mouseleave={() => (hover = false)}
	/>
	{#if hover}
		<div class="description-wrapper" transition:fly|local={{ y: 10, duration: 400 }}>
			<span class="title">{badgeLevel.name}</span>
			<span class="goal xsmall">
				<Icon icon="tabler:circle-check" />
				{badgeLevel.goal}
			</span>
			<span class="description">{badgeLevel.description}</span>
		</div>
	{/if}
</div>

<style lang="scss">
	.main-wrapper {
		position: relative;

		img {
			width: 40px;
			height: 40px;
			border-radius: 50%;
		}

		.description-wrapper {
			position: absolute;
			background-color: var(--clr-surface-secondary);
			bottom: -155px;
			left: -80px;
			padding: var(--space-4);
			border-radius: var(--radius-1);
			width: 300px;
			display: flex;
			flex-direction: column;
			gap: var(--space-2);
			z-index: 10;

			.title {
				font-size: var(--font-size-1);
				color: var(--clr-heading-main);
			}

			.goal {
				color: var(--clr-primary-main);
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: var(--space-1);
			}

			.description {
				font-size: var(--font-size-1);
			}
		}
	}
</style>
