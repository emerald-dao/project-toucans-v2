<!-- Page that dynamically renders each step of the DAO Generation process -->
<script>
	import { Section, Container, Row } from '@mateoroldos/svelte.bones';
	import { Button } from '@emerald-dao/component-library';
	import { activeStep } from '$lib/stores/generator/ActiveStep';
	import { steps } from '$stores/generator/StepsStore';

	import { browser } from '$app/environment';
</script>

<Container width="small" --container-s="30ch">
	{#if browser}
		<svelte:component this={$steps[$activeStep].component} />
	{/if}
	<Row>
		<Button type="ghost" on:click={activeStep.decrement}>Previous</Button>
		<Button on:click={activeStep.increment}>Next</Button>
		<!-- <Button on:click={activeStep.reset}>Reset</Button> -->
	</Row>
</Container>
