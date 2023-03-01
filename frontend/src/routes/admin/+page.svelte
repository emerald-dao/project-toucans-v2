<script type="ts">
	import { type CommunityDao, DaoType, type FinancialDao } from '$lib/types/dao-project/dao-project.interface';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import CommunityDaoStats from './__components/sections/CommunityDaoStats.svelte';
	import FinancialDaoStats from './__components/sections/FinancialDaoStats.svelte';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: FinancialDao[] | CommunityDao[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;

	$: activeDaoData = adminData.userDaos[$activeDaoStore];
</script>

{#if activeDaoData.type === DaoType.Financial}
	<FinancialDaoStats daoData={activeDaoData} />
{:else if activeDaoData.type === DaoType.Community}
	<CommunityDaoStats daoData={activeDaoData} />
{/if}
