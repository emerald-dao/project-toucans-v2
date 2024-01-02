<script lang="ts">
	import Icon from '@iconify/svelte';

	export let name: string;
	export let icon: string;
</script>

<div>
	<Icon {icon} height="1.7em" />
	<span>
		{name}
	</span>
</div>

<style lang="scss">
	div {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		color: var(--clr-heading-main);
		padding: var(--space-2) var(--space-4);
		background-color: var(--clr-surface-primary);
		border-radius: 8px;
		font-size: var(--font-size-3);
		border: 1px solid var(--clr-border-primary);
	}
</style>
