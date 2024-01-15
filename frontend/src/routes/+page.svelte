<script lang="ts">
	import HeroSection from './_components/sections/hero-section/HeroSection.svelte';
	import LeadingProjectsSection from './_components/sections/leading-projects-section/LeadingProjectsSection.svelte';
	import TokenCommunityManagement from './_components/sections/TokenCommunityManagement.svelte';
	import CommunityTypesUnlock from './_components/sections/community-types-section/CommunityTypesSection.svelte';
	import CreateYourDao from './_components/sections/CreateYourDao.svelte';
	import { StatsSection } from '@emerald-dao/component-library';
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
	import DaoOfTheMonth from './_components/sections/DaoOfTheMonth.svelte';
	import TechnicalDetailsSection from './_components/sections/TechnicalDetailsSection.svelte';
	import CommunityToolBox from './_components/sections/community-toolbox/CommunityToolbox.svelte';

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
	<HeroSection />
	<LeadingProjectsSection projects={data.projects} allProjects={data.allProjects} />
	<TokenCommunityManagement />
	<StatsSection background={'#1B1B1B'} data={statsData} />
	<CommunityToolBox />
	<CommunityTypesUnlock />
	<!-- <TechnicalDetailsSection /> -->
	<DaoOfTheMonth {projects} daoOfTheMonth={daoRankings[0]} />
	<CreateYourDao />
</div>

<style lang="scss">
	.no-overflow-x {
		overflow-x: hidden;
	}
</style>
