<script type="ts">
	import Icon from '@iconify/svelte';

	export let title: string;
	export let data: string | number;
	export let icon: string;
</script>

<div class="card column-1">
	<div class="row-2">
		<Icon {icon} />
		<span class="small">{title}</span>
	</div>
	<span class="h4">{data}</span>
</div>

<style type="scss">
	.card {
		width: 100%;
	}
</style>
