<script type="ts">
	import { fly } from 'svelte/transition';
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import type { DAOProject, DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
	import Stake from './components/Stake.svelte';

	const adminData: {
		activeDao: Writable<DAOProject>;
		otherDaos: DaoDatabaseData[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	$: activeDaoData = $activeDaoStore;
</script>

<div in:fly={{ x: 10, duration: 400 }}>
	<Stake daoData={activeDaoData} />
</div>

<style lang="scss">
	div {
		display: flex;
		flex: 1;
	}
</style>
