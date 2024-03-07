<script lang="ts">
	import { StatsSection } from '@emerald-dao/component-library';
	import HeroSection from './_components/sections/hero-section/HeroSection.svelte';
	import LeadingProjectsSection from './_components/sections/leading-projects-section/LeadingProjectsSection.svelte';
	import ProductShowcaseSection from './_components/sections/product-showcase-section/ProductShowcaseSection.svelte';
	import CommunityTypesSection from './_components/sections/community-types-section/CommunityTypesSection.svelte';
	import CreateYourDaoSection from './_components/sections/create-your-dao-section/CreateYourDaoSection.svelte';
	import CommunityToolboxSection from './_components/sections/community-toolbox-section/CommunityToolboxSection.svelte';
	import { getToucansStats } from './_data/getToucansStats';
	import OpenGraph from '$components/OpenGraph.svelte';

	export let data;
</script>

<svelte:head>
	<OpenGraph />
</svelte:head>

<!-- The .no-overflow-x div is a css hack to hide the overflow-x of Hero section without generating a vertical scrollbar -->
<div class="no-overflow-x">
	<HeroSection />
	{#if data.projectsRakings.length > 0}
		<LeadingProjectsSection projectsRakings={data.projectsRakings} />
	{/if}
	<ProductShowcaseSection />
	<StatsSection
		background={'var(--clr-surface-primary)'}
		data={getToucansStats(data.projectsRakings.length)}
	/>
	<CommunityToolboxSection />
	<CommunityTypesSection />
	<!-- {#if daoOfTheMonth}
		<DaoOfTheMonthSection {daoOfTheMonth} />
	{/if} -->
	<CreateYourDaoSection />
</div>

<style lang="scss">
	.no-overflow-x {
		overflow-x: hidden;
	}
</style>
