<script type="ts">
	import { type CommunityDao, DaoType, type FinancialDao } from '$lib/types/dao-project.interface';
	import { getContext } from 'svelte';
	import CommunityDaoStats from './components/sections/CommunityDaoStats.svelte';
	import FinancialDaoStats from './components/sections/FinancialDaoStats.svelte';

	const daoData: CommunityDao | FinancialDao = getContext('dao-data');
</script>

{#if daoData.type === DaoType.Financial}
	<FinancialDaoStats {daoData} />
{:else if daoData.type === DaoType.Community}
	<CommunityDaoStats {daoData} />
{/if}
