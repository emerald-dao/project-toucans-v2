<script type="ts">
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';

	export let message: string | null | string[];
	export let type: 'error' | 'loading';
</script>

{#if message}
	<div in:fly={{ y: 4, duration: 400 }}>
		{#if type === 'error'}
			<Icon icon="tabler:x" color="var(--clr-alert-main)" width="0.75em" />
		{/if}
		<span class={type}>{message}</span>
	</div>
{/if}

<style type="scss">
	div {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		gap: 0.2em;
		margin-top: 0.05em;

		span {
			font-size: var(--fs-100);
		}

		.error {
			color: var(--clr-alert-main);
		}

		.loading {
			color: var(--clr-secondary-main);
		}
	}
</style>
