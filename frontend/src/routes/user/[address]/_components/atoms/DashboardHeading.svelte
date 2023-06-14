<script lang="ts">
	import Icon from '@iconify/svelte';

	export let icon: string | undefined = undefined;
</script>

<h4>
	{#if icon}
		<Icon {icon} />
	{/if}
	<slot />
</h4>

<style lang="scss">
	h4 {
		font-size: var(--font-size-2);
		color: var(--clr-text-primary);
		opacity: 0.8;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
	}
</style>
