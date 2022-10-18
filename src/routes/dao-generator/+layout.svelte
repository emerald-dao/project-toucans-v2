<script>
	import { GeneratorNav } from './components';
	import { Column, Section } from '@mateoroldos/svelte.bones';
</script>

<Section>
	<Column>
		<GeneratorNav />
		<slot />
	</Column>
</Section>
