<script lang="ts">
	import { Label } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let address: string;
	export let i: number;
</script>

<div class="main-wrapper">
	<div class="row-4 align-center">
		<div class="avatar-wrapper">
			<img src="/avatar-2.png" alt="" />
			<span class="number">{i + 1}</span>
		</div>
		<span class="">{address}</span>
	</div>
	{#if i === 0}
		<Label size="x-small" hasBorder={false}>Owner</Label>
	{:else}
		<Icon icon="tabler:trash" />
	{/if}
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px var(--clr-neutral-badge) solid;
		padding-bottom: var(--space-4);
		padding-inline: var(--space-4);

		.avatar-wrapper {
			position: relative;

			img {
				width: 40px;
				aspect-ratio: 1 / 1;
				object-fit: cover;
				border: 1px solid var(--clr-border-primary);
				border-radius: var(--radius-2);
			}

			.number {
				font-size: 0.7em;
				color: var(--clr-text-off);
				background-color: var(--clr-surface-primary);
				width: 1.6em;
				height: 1.6em;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				border: 0.5px var(--clr-border-primary) solid;
				position: absolute;
				right: -4px;
				bottom: -4px;
			}
		}
	}
</style>
