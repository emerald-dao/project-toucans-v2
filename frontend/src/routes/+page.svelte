<script type="ts">
	import CreateYourToken from './_components/sections/CreateYourToken.svelte';
	import Hero from './_components/sections/Hero.svelte';
	import ToucansFeatures from './_components/sections/ToucansFeatures.svelte';
	import LeadingProjects from './_components/sections/LeadingProjects.svelte';
	import { StatsSection, PoweredByECDAO } from '@emerald-dao/component-library';

	export let data;

	const statsData = {
		data1: { title: '', stat: '' },
		data2: { title: '', stat: '' },
		data3: { title: '', stat: '' }
	};
</script>

<!-- The .no-overflow-x div is a css hack to hide the overflow-x of Hero section without generating a vertical scrollbar -->
<div class="no-overflow-x">
	<Hero />
	<ToucansFeatures />
	<LeadingProjects projects={data.projects} />
</div>
<CreateYourToken />
<!-- <StatsSection bordersColor="var(--clr-border-primary)" data={statsData} /> -->
<PoweredByECDAO />

<style lang="scss">
	.no-overflow-x {
		overflow-x: hidden;
	}
</style>
