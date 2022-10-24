<script>
	import Icon from '@iconify/svelte';
	import { Button } from '@emerald-dao/component-library';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';
	import { GeneratorNav } from './components';
	import { Container, Section } from '@mateoroldos/svelte.bones';
</script>

<Section paddingTop="none">
	<GeneratorNav />
	<div class="content-wrapper">
		<Container width="small" --container-s="34ch">
			<h2>{$generatorSteps[$generatorActiveStep].title}</h2>
			<slot />
		</Container>
	</div>
</Section>

<style type="scss">
	.content-wrapper {
		margin-top: 2.8rem;

		h2 {
			font-size: var(--fs-400);
			font-family: var(--ff-main);
			margin-bottom: 2.4rem;
		}
	}
</style>
