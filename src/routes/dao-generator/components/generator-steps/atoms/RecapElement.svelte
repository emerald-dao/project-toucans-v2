<script type="ts">
	import Icon from '@iconify/svelte';
	import { Column, Row } from '@mateoroldos/svelte.bones';

	export let title: string | null = null;
	export let data: string | number | boolean | undefined;
	export let icon: string | null = null;
</script>

{#if (typeof data != 'boolean' && data) || typeof data === 'boolean'}
	<Column gap={0.2} align="flex-start">
		{#if title}
			<Row gap={0.3}>
				{#if icon}
					<Icon {icon} color="var(--clr-font-text-soft-t3)" />
				{/if}
				<h5>{title}</h5>
			</Row>
		{/if}
		{#if typeof data === 'boolean'}
			{#if data}
				<Icon icon="tabler:circle-check" color="var(--clr-primary-main)" />
			{:else}
				<Icon icon="tabler:circle-x" color="var(--clr-alert-main)" />
			{/if}
		{:else}
			<span>{data}</span>
		{/if}
	</Column>
{/if}

<style type="scss">
	h5 {
		margin: 0;
		color: var(--clr-font-text-soft-t4);
		font-size: var(--fs-200);
	}

	span {
		font-size: var(--fs-300);
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>
