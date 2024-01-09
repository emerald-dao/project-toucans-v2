<script lang="ts">
	import { fly } from 'svelte/transition';
</script>

<div class="column-6" in:fly={{ x: 10, duration: 400 }}>
	<slot />
</div>

<style>
	div {
		flex: 1;
	}
</style>
