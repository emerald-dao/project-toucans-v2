<script type="ts">
	import { fly } from 'svelte/transition';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import Stake from './components/Stake.svelte';

	export let data;

	let activeDao = data.activeDao as DAOProject;
</script>

<div in:fly={{ x: 10, duration: 400 }}>
	<Stake daoData={activeDao} />
</div>

<style lang="scss">
	div {
		display: flex;
		flex: 1;
	}
</style>
