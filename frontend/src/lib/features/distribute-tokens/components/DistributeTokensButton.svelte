<script lang="ts">
	import { Button } from '@emerald-dao/component-library';
	import { fly } from 'svelte/transition';

	export let disabled: boolean;
</script>

<div in:fly|local={{ y: 10, duration: 500, delay: 50 }}>
	<Button width="full-width" state={disabled ? 'disabled' : 'active'} on:click><slot /></Button>
</div>
