<script>
	import { GeneratorNav } from '$components/sections/dao-generator';
	import { Section } from '@mateoroldos/svelte.bones';
</script>

<Section>
	<GeneratorNav />
	<slot />
</Section>
