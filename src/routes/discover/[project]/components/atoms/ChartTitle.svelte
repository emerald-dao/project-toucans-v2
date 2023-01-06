<script type="ts">
	import Icon from '@iconify/svelte';
	export let title: string;
	export let data: string;
	export let icon: string;
</script>

<div class="data-wrapper">
	<div class="column-1">
		<div class="row-2 align-center">
			<Icon {icon} />
			<span>{title}</span>
		</div>
		<h4 class="heading w-medium">{data}</h4>
	</div>
</div>

<style type="scss">
	.data-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	span {
		font-size: var(--font-size-4);
	}
</style>
