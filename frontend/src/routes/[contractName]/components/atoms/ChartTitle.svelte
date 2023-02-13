<script type="ts">
	import Icon from '@iconify/svelte';

	export let title: string;
	export let icon: string;
</script>

<div class="data-wrapper">
	<div class="row-2 align-center">
		<Icon {icon} />
		<span>{title}</span>
	</div>
	<slot />
</div>

<style type="scss">
	.data-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		@include mq('small') {
			flex-direction: column;
		}
	}
	span {
		font-size: var(--font-size-4);
	}
</style>
