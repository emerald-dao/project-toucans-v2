<script>
	import Icon from '@iconify/svelte';
	import { Button } from '@emerald-dao/component-library';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';
	import { GeneratorNav } from './components';
	import { Container, Section } from '@mateoroldos/svelte.bones';
</script>

<Section paddingTop="none">
	<div class="nav-wrapper">
		<GeneratorNav />
	</div>
	<div class="content-wrapper">
		<Container width="small" --container-s="34ch">
			<slot />
		</Container>
	</div>
</Section>

<style type="scss">
	.nav-wrapper {
		display: none;

		@include mq('small') {
			display: block;
		}
	}
	.content-wrapper {
		margin-top: 2.8rem;
	}
</style>
