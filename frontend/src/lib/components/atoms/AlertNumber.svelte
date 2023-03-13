<script lang="ts">
	import Icon from '@iconify/svelte';

	export let number: number;
</script>

<span class="w-medium center" class:done={number === 0}>
	{#if number === 0}
		<Icon icon="tabler:check" />
	{:else}
		{number}
	{/if}
</span>

<style type="scss">
	span {
		width: 13px;
		height: 13px;
		background-color: var(--clr-alert-main);
		color: var(--clr-heading-inverse);
		font-size: 0.6rem;
		border-radius: 50%;
		font-family: var(--font-text);

		&.done {
			background-color: var(--clr-primary-main);
		}
	}
</style>
