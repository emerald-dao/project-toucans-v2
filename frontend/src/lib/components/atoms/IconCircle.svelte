<script type="ts">
	import Icon from '@iconify/svelte';

	export let icon: string;
	export let color: 'primary' | 'secondary' | 'tertiary' = 'tertiary';
</script>

<div class={`icon-wrapper ${color}`}>
	{#if icon.length > 1}
		<Icon {icon} width="0.9rem" />
	{:else}
		<span class="xsmall w-medium">{icon}</span>
	{/if}
</div>

<style lang="scss">
	.icon-wrapper {
		border-radius: 50%;
		width: 1.7em;
		height: 1.7em;
		display: flex;
		align-items: center;
		justify-content: center;

		&.primary {
			background-color: var(--clr-primary-badge);
			color: var(--clr-primary-main);

			span {
				color: var(--clr-primary-main);
			}
		}

		&.secondary {
			background-color: var(--clr-secondary-badge);
			color: var(--clr-secondary-main);

			span {
				color: var(--clr-secondary-main);
			}
		}

		&.tertiary {
			background-color: var(--clr-tertiary-badge);
			color: var(--clr-tertiary-main);

			span {
				color: var(--clr-tertiary-main);
			}
		}
	}
</style>
