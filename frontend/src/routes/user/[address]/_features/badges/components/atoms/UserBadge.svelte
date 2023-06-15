<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { Level } from '../../badges.interfaces';
	import Icon from '@iconify/svelte';

	export let badgeLevel: Level;
	export let noLevel: boolean = false;
	export let levelNumber: number;
	export let nextLevelGoal: string | undefined = undefined;

	let hover = false;
</script>

<div class="column-1 align-center main-wrapper">
	<div class="column-2 align-center">
		<img
			src={badgeLevel.image}
			class:off={noLevel}
			alt="Badge"
			on:mouseenter={() => (hover = true)}
			on:mouseleave={() => (hover = false)}
		/>
		{#if !noLevel}
			<span class="level xsmall">Level {levelNumber}</span>
		{/if}
	</div>
	{#if hover}
		<div class="description-wrapper" transition:fly|local={{ y: 10, duration: 400 }}>
			<span class="title">{badgeLevel.name}</span>
			<span class="goal xsmall" class:off={noLevel}>
				{#if noLevel}
					<Icon icon="tabler:circle-x" />
				{:else}
					<Icon icon="tabler:circle-check" />
				{/if}
				{badgeLevel.goal}
				{#if noLevel}
					to get this badge
				{/if}
			</span>
			{#if !noLevel}
				<span class="description">{badgeLevel.description}</span>
			{/if}
			{#if nextLevelGoal}
				<span class="goal xsmall off">
					{nextLevelGoal} to get next level
				</span>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.main-wrapper {
		position: relative;

		img {
			width: 60px;
			height: 60px;
			border-radius: 50%;

			&.off {
				opacity: 0.2;
			}
		}

		.level {
			background-color: var(--clr-neutral-badge);
			padding-inline: var(--space-2);
			border-radius: var(--radius-1);
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

				&.off {
					color: var(--clr-alert-main);
				}
			}

			.description {
				font-size: var(--font-size-1);
			}
		}
	}
</style>
