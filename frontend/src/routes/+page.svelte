<script lang="ts">
	import CreateYourToken from './_components/sections/CreateYourToken.svelte';
	import Hero from './_components/sections/Hero.svelte';
	import ToucansFeatures from './_components/sections/ToucansFeatures.svelte';
	import LeadingProjects from './_components/sections/LeadingProjects.svelte';
	import { PoweredByECDAO } from '@emerald-dao/component-library';
	import TokenCommunityManagement from './_components/sections/TokenCommunityManagement.svelte';
	import CommunityTypesUnlock from './_components/sections/CommunityTypesUnlock.svelte';
	import CreateYourDao from './_components/sections/CreateYourDao.svelte'
	import { StatsSection } from '@emerald-dao/component-library';
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
	import DaoOfTheMonth from './_components/sections/DaoOfTheMonth.svelte';
	import TechnicalDetailsSection from './_components/sections/TechnicalDetailsSection.svelte';
	import CommunityToolBox from './_components/sections/CommunityToolBox.svelte';
	import CommunityType from './_components/sections/atoms/CommunityType.svelte';
	import { daoAndTokenGeneratorActiveStep } from '$lib/features/dao-generator/stores/DaoGeneratorSteps';

	export let data;

	const projects: DaoDatabaseData[] = data.allProjects as DaoDatabaseData[];
	const daoRankings = data.projects.sort((a, b) => b.treasury_value - a.treasury_value);
	const statsData = {
		data1: { title: 'DAOs created', stat: `${data.allProjects.length}` },
		data2: { title: 'Total market cap', stat: '+33k' },
		data3: { title: 'Funds raised', stat: '+15k' }
	};
	

</script>

<!-- The .no-overflow-x div is a css hack to hide the overflow-x of Hero section without generating a vertical scrollbar -->
<div class="no-overflow-x">
	<Hero />
	<LeadingProjects projects={data.projects} allProjects={data.allProjects} />
	<TokenCommunityManagement/>
	<CommunityToolBox/>
	<CommunityTypesUnlock/>
	<TechnicalDetailsSection/>
	<DaoOfTheMonth {projects} daoOfTheMonth={daoRankings[0]}/>
	<StatsSection background={"#1B1B1B"} data={statsData}/>
	<CreateYourDao/>
</div>

<style lang="scss">
	.no-overflow-x {
		overflow-x: hidden;
	}
</style>
