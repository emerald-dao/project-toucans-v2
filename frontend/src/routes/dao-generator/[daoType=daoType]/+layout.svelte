<script>
	import { Container, Section } from '@mateoroldos/svelte.bones';
	import GeneratorNav from '$lib/features/dao-generator/components/navigation/GeneratorNav.svelte';
	import {
		daoGeneratorSteps,
		daoAndTokenGeneratorSteps,
		daoGeneratorActiveStep,
		daoAndTokenGeneratorActiveStep
	} from '$lib/features/dao-generator/stores/DaoGeneratorSteps';
	import { setContext } from 'svelte';
	import { page } from '$app/stores';
	import { daoAndTokenGeneratorData } from '$lib/features/dao-generator/stores/DaoAndTokenGeneratorData';
	import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';

	$: $page.params.daoType === 'dao-token'
		? setContext('daoGeneratorActiveStep', daoAndTokenGeneratorActiveStep)
		: setContext('daoGeneratorActiveStep', daoGeneratorActiveStep);

	$: $page.params.daoType === 'dao-token'
		? setContext('daoGeneratorSteps', daoAndTokenGeneratorSteps)
		: setContext('daoGeneratorSteps', daoGeneratorSteps);

	$: $page.params.daoType === 'dao-token'
		? setContext('daoGeneratorData', daoAndTokenGeneratorData)
		: setContext('daoGeneratorData', daoGeneratorData);
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
