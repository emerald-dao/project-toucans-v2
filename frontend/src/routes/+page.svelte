<script lang="ts">
	import { StatsSection } from '@emerald-dao/component-library';
	import HeroSection from './_components/sections/hero-section/HeroSection.svelte';
	import LeadingProjectsSection from './_components/sections/leading-projects-section/LeadingProjectsSection.svelte';
	import ProductShowcaseSection from './_components/sections/product-showcase-section/ProductShowcaseSection.svelte';
	import CommunityTypesSection from './_components/sections/community-types-section/CommunityTypesSection.svelte';
	import CreateYourDaoSection from './_components/sections/create-your-dao-section/CreateYourDaoSection.svelte';
	import DaoOfTheMonthSection from './_components/sections/dao-of-the-month-section/DaoOfTheMonthSection.svelte';
	import CommunityToolboxSection from './_components/sections/community-toolbox-section/CommunityToolboxSection.svelte';
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
	import { getToucansStats } from './_data/getToucansStats';

	export let data;

	const projects: DaoDatabaseData[] = data.allProjects as DaoDatabaseData[];
	const daoRankings = data.projects.sort((a, b) => b.treasury_value - a.treasury_value);
</script>

<!-- The .no-overflow-x div is a css hack to hide the overflow-x of Hero section without generating a vertical scrollbar -->
<div class="no-overflow-x">
	<HeroSection />
	<LeadingProjectsSection allProjects={projects} />
	<ProductShowcaseSection />
	<StatsSection background={'var(--clr-surface-primary)'} data={getToucansStats(projects.length)} />
	<CommunityToolboxSection />
	<CommunityTypesSection />
	<DaoOfTheMonthSection {projects} daoOfTheMonth={daoRankings[0]} />
	<CreateYourDaoSection />
</div>

<style lang="scss">
	.no-overflow-x {
		overflow-x: hidden;
	}
</style>
