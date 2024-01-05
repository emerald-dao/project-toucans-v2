<script lang="ts">
	import Icon from '@iconify/svelte';

	export let check: boolean;
	export let text: string;
</script>

<span class="row-1 align-center small">
	{#if check}
		<Icon icon="tabler:circle-check" color="var(--clr-primary-main)" />
	{:else}
		<Icon icon="tabler:circle-x" color="var(--clr-alert-main)" />
	{/if}
	{text}
</span>

<style lang="scss">
	span {
		background-color: var(--clr-neutral-badge);
		padding: var(--space-1) var(--space-3);
		border-radius: var(--radius-1);
	}
</style>
