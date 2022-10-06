<script type="ts">
	import type { Step } from '$lib/types/generator-step.interface';
	import { Ball } from '$atoms';
	import { Column, Row } from '@mateoroldos/svelte.bones';

	export let steps: Step[];
</script>

<Row>
	{#each steps as step, i}
		<Column gap={1}>
			{step.title}
			<Ball status={step.state}>
				{i + 1}
			</Ball>
		</Column>
	{/each}
</Row>

<style type="scss">
</style>
