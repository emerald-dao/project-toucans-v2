<script type="ts">
	import Icon from '@iconify/svelte';
	export let title: string;
	export let data: string;
	export let icon: string;
</script>

<div class="column-1">
	<div class="row-2 align-center">
		<Icon {icon} />
		<span>{title}</span>
	</div>
	<h4>{data}</h4>
</div>
