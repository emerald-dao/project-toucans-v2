<script type="ts">
	import { Currency, TooltipIcon } from '@emerald-dao/component-library';
	// import { formatFix } from '$flow/utils';
	import Icon from '@iconify/svelte';

	export let title: string;
	export let data: string | number | null = null;
	export let isCurrency: boolean = false;
	export let currencyName: string = 'FLOW';
	export let icon: string | null = null;
	export let hasBackground: boolean = false;
	export let width: '100%' | 'fit-content' = '100%';
	export let height: '100%' | 'fit-content' = 'fit-content';
	export let paddingInline = 'var(--space-5)';
	export let paddingBlock = 'var(--space-5)';
	export let color: 'heading' | 'text' | 'primary' | 'secondary' | 'tertiary' = 'heading';
	export let fontSize = 'var(--font-size-2)';
	export let tooltip: string | null = null;
</script>

<div
	class="card"
	class:card-primary={hasBackground}
	style={`width: ${width}; height: ${height}; padding: ${paddingBlock} ${paddingInline}; font-size: ${fontSize}`}
>
	<div class="row-1 align-center">
		{#if icon}
			<Icon {icon} />
		{/if}
		<span class="xsmall">{title}</span>
		{#if tooltip != null}
			<TooltipIcon {tooltip} width={0.6} />
		{/if}
	</div>
	{#if data !== null}
		{#if isCurrency}
			<Currency amount={Number(data)} currency={currencyName} color="heading" {fontSize} />
		{:else}
			<span class={`color-${color}`} style={`font-size: ${fontSize}`}>{data}</span>
		{/if}
	{/if}
	<slot />
</div>

<style type="scss">
	.card {
		padding: var(--space-2) var(--space-3);
		display: flex;
		flex-direction: column;
		gap: 0.3em;

		@include mq('small') {
			padding: var(--space-5) var(--space-7);
		}

		.color-heading {
			color: var(--clr-heading-main);
		}

		.color-text {
			color: var(--clr-text-primary);
		}

		.color-primary {
			color: var(--clr-primary-main);
		}

		.color-secondary {
			color: var(--clr-secondary-main);
		}

		.color-tertiary {
			color: var(--clr-tertiary-main);
		}
	}
</style>
