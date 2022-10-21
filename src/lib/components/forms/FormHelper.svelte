<script type="ts">
	import Icon from '@iconify/svelte';
	import { Row } from '@mateoroldos/svelte.bones';
	import { fly } from 'svelte/transition';

	export let message: string | null | string[];
	export let type: 'error' | 'loading';
</script>

{#if message}
	{#each message as msg}
		<div in:fly={{ y: 4, duration: 300 }}>
			{#if type === 'error'}
				<Icon icon="tabler:x" color="var(--clr-alert-main)" width="0.75em" />
			{/if}
			<span class={type}>{msg}</span>
		</div>
	{/each}
{/if}

<style type="scss">
	div {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		gap: 0.2em;
		margin-top: 0.3em;

		span {
			font-size: var(--fs-200);
		}

		.error {
			color: var(--clr-alert-main);
		}

		.loading {
			color: var(--clr-secondary-main);
		}
	}
</style>
