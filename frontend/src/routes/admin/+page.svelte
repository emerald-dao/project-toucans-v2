<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import CommunityDaoStats from './_components/sections/CommunityDaoStats.svelte';
	import FinancialDaoStats from './_components/sections/FinancialDaoStats.svelte';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: DAOProject[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;

	$: activeDaoData = adminData.userDaos[$activeDaoStore];
</script>

<FinancialDaoStats daoData={activeDaoData} />
