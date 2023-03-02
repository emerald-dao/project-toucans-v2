<script type="ts">
	import CreateYourToken from './_components/sections/CreateYourToken.svelte';
	import Hero from './_components/sections/Hero.svelte';
	import ToucansFeatures from './_components/sections/ToucansFeatures.svelte';
	import LeadingProjects from './_components/sections/LeadingProjects.svelte';
	import { StatsSection, PoweredByECDAO } from '@emerald-dao/component-library';
</script>

<Hero />
<ToucansFeatures />
<LeadingProjects />
<CreateYourToken />
<StatsSection bordersColor="var(--clr-border-primary)" />
<PoweredByECDAO />
