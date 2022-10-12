<script type="ts">
	import { steps } from '$stores/generator/StepsStore';
	import { Ball } from '$atoms';
	import { Column, Row } from '@mateoroldos/svelte.bones';
</script>

<nav>
	<Row>
		{#each $steps as step, i}
			<Column gap={1}>
				{step.title}
				<Ball status={step.state}>
					{i + 1}
				</Ball>
			</Column>
		{/each}
	</Row>
</nav>
