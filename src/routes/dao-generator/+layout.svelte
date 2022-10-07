<script>
	import { GeneratorNav } from '$components/sections/dao-generator';
	import { Column, Section } from '@mateoroldos/svelte.bones';
</script>

<Section>
	<Column>
		<GeneratorNav />
		<slot />
	</Column>
</Section>
