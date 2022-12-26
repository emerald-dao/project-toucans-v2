<script type="ts">
	import { Column } from '@mateoroldos/svelte.bones';
	import CreateYourToken from './components/sections/CreateYourToken.svelte';
	import Hero from './components/sections/Hero.svelte';
	import ToucansFeatures from './components/sections/ToucansFeatures.svelte';
	import LeadingProjects from './components/sections/LeadingProjects.svelte';
</script>

<Hero />
<ToucansFeatures />
<LeadingProjects />
<CreateYourToken />

<div class="section">
	<div class="container">
		<Column>
			<h2>FAQ</h2>
		</Column>
	</div>
</div>

<div class="section">
	<div class="container">
		<Column>
			<h2>Powerd by <strong>Emerald City</strong></h2>
		</Column>
	</div>
</div>
