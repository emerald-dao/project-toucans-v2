<script type="ts">
	import Icon from '@iconify/svelte';

	export let title: string;
	export let data: string | number;
	export let icon: string | null = null;
	export let hasBackground: boolean = false;
	export let width: '100%' | 'fit-content' = '100%';
</script>

<div class="card column-6" class:card-primary={hasBackground} style={`width: ${width}`}>
	<div class="column-1">
		<div class="row-2">
			{#if icon}
				<Icon {icon} />
			{/if}
			<span class="small">{title}</span>
		</div>
		<span class="h4 w-medium">{data}</span>
	</div>
	<slot />
</div>

<style type="scss">
	.card {
		padding: var(--space-2) var(--space-3);
		@include mq('small') {
			padding: var(--space-5) var(--space-7);
		}
	}
</style>
