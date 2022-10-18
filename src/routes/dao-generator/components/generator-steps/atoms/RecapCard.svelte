<script type="ts">
	import { Card } from '$components/atoms';
	import { Column } from '@mateoroldos/svelte.bones';
	import { Button } from '@emerald-dao/component-library';
	import { generatorActiveStep } from '$stores/generator/GeneratorSteps';

	export let title: string;
	export let stepNumber: number;
</script>

<Card padding={2.7} width="100%">
	<Column gap="none" align="flex-start" justify="flex-start">
		<h4>{title}</h4>
		<slot />
		<Button type="transparent" on:click={() => generatorActiveStep.goToStep(stepNumber)}
			>Edit</Button
		>
	</Column>
</Card>
