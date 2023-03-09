<script type="ts">
	import Icon from '@iconify/svelte';

	export let title: string | null = null;
	export let data: string | number | boolean | undefined;
	export let icon: string | null = null;
</script>

<div class="column main-wrapper">
	{#if title}
		<div class="title-wrapper row-1 align-center">
			{#if icon}
				<Icon {icon} color="var(--clr-font-text-soft-t3)" />
			{/if}
			{#if typeof data === 'boolean'}
				{#if data}
					<Icon icon="tabler:circle-check" color="var(--clr-primary-main)" />
				{:else}
					<Icon icon="tabler:circle-x" color="var(--clr-alert-main)" />
				{/if}
			{/if}
			<span class="title">{title}</span>
		</div>
	{/if}
	{#if typeof data != 'boolean'}
		<span class="small">{data}</span>
	{/if}
</div>

<style type="scss">
	.title-wrapper {
		margin-bottom: -5px;
		.title {
			color: var(--clr-text-off);
			font-size: var(--font-size-0);
		}
	}

	span {
		font-size: var(--font-size-2);
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		-webkit-box-orient: vertical;
	}
</style>
