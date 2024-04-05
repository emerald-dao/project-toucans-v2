<script type="ts">
	import { fly } from 'svelte/transition';
	import Stake from './components/Stake.svelte';

	export let data;
</script>

<div in:fly={{ x: 10, duration: 400 }}>
	<Stake daoData={data.activeDao} />
</div>

<style lang="scss">
	div {
		display: flex;
		flex: 1;
	}
</style>
