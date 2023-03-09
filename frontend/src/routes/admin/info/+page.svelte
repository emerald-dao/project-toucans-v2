<script lang="ts">
	import { fly } from 'svelte/transition';
</script>

<div in:fly={{ x: 10, duration: 400 }}>todo</div>
