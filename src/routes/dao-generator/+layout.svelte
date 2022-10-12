<script>
	import { GeneratorNav } from '$components/pages/dao-generator';
	import { Column, Section } from '@mateoroldos/svelte.bones';
</script>

<Section>
	<Column>
		<GeneratorNav />
		<slot />
	</Column>
</Section>
