<script type="ts">
	import CreateYourToken from './__components/sections/CreateYourToken.svelte';
	import Hero from './__components/sections/Hero.svelte';
	import ToucansFeatures from './__components/sections/ToucansFeatures.svelte';
	import LeadingProjects from './__components/sections/LeadingProjects.svelte';
	import { StatsSection, PoweredByECDAO } from '@emerald-dao/component-library';
</script>

<Hero />
<ToucansFeatures />
<LeadingProjects />
<CreateYourToken />
<StatsSection bordersColor="var(--clr-border-primary)" />
<PoweredByECDAO />
