<script type="ts">
	import HeroSection from './_components/sections/HeroSection.svelte';
	import FeaturedDaoSection from './_components/sections/FeaturedDaoSection.svelte';
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface.js';
	import HotestProjectsSection from './_components/sections/HotestProjectsSection.svelte';
	import ProjectsGridSection from './_components/sections/ProjectsGridSection.svelte';
	import { PUBLIC_FLOW_NETWORK } from '$env/static/public';
	import { Seo } from '@emerald-dao/component-library';

	export let data;

	const projects: DaoDatabaseData[] = data.allProjects as DaoDatabaseData[];

	const DOMInfo = {
		projectId:
			PUBLIC_FLOW_NETWORK === 'emulator'
				? 'TestingDAO'
				: PUBLIC_FLOW_NETWORK === 'testnet'
				? 'TestToken'
				: 'BallerzFC',
		story:
			'One of the first DAOs created on the platform, Ballerz FC has formed a strong community of Ballerz FC and broader MFL lovers.'
	};
	const DOM: DaoDatabaseData = projects.find(
		(project) => project.project_id === DOMInfo.projectId
	) as DaoDatabaseData;

	const ECDAOInfo = {
		projectId:
			PUBLIC_FLOW_NETWORK === 'emulator'
				? 'TestingDAO'
				: PUBLIC_FLOW_NETWORK === 'testnet'
				? 'TestToken'
				: 'EmeraldCity',
		story:
			'Toucans was created by the members of Emerald City DAO, the first DAO built #onFlow. We are a group of passionate builders crafting the future of Flow, the blockchain made for scalable and secure mainstream usage.'
	};
	const ECDAO: DaoDatabaseData = projects.find(
		(project) => project.project_id === ECDAOInfo.projectId
	) as DaoDatabaseData;

	$: thisMonth = new Date().toLocaleString('default', { month: 'long' });
</script>

<Seo
	title={`Discover | Toucans`}
	description={`Discover all the DAO projects generated in Toucans`}
	type="WebPage"
	image="https://toucans.ecdao.org/favicon.png"
/>

<HeroSection />
<HotestProjectsSection daoRankings={data.daoRankings} tokenRankings={data.tokenRankings} />
{#if DOM}
	<FeaturedDaoSection project={DOM} story={DOMInfo.story} title={`DAO of ${thisMonth}`} />
{/if}
<FeaturedDaoSection
	project={ECDAO}
	story={ECDAOInfo.story}
	title={`Emerald City DAO - the creators of Toucans`}
/>
<ProjectsGridSection {projects} />
