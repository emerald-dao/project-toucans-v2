<script type="ts">
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';

	export let message: string | null;
</script>

<div class="error-wrapper">
	{#if message}
		<span class="error" transition:fly={{ y: 2, duration: 200 }}>{message}</span>
	{/if}
</div>

<style type="scss">
	.error-wrapper {
		height: 2.8rem;

		.error {
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-top: 0.2em;
			gap: 0.3em;
			color: var(--clr-alert-main);
			font-size: var(--fs-200);
		}
	}
</style>
