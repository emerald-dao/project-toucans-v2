<script>
	import Icon from '@iconify/svelte';
	import { Button } from '@emerald-dao/component-library';
	import {
		daoGeneratorSteps,
		generatorActiveStep
	} from '$lib/features/dao-generator/stores/DaoGeneratorSteps';
	import { Container, Section } from '@mateoroldos/svelte.bones';
	import GeneratorNav from '$lib/features/dao-generator/components/navigation/GeneratorNav.svelte';
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
