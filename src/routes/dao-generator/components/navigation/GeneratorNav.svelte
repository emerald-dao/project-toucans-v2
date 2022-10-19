<script type="ts">
	import { generatorSteps } from '$stores/generator/GeneratorSteps';
	import { Ball } from '$atoms';
	import { Column, Row } from '@mateoroldos/svelte.bones';
</script>

<nav>
	<Row>
		{#each $generatorSteps as step, i}
			<Column gap={0.6}>
				<span>
					{step.title}
				</span>
				<Ball status={step.state} width={1.4} />
			</Column>
		{/each}
	</Row>
</nav>

<style type="scss">
	nav {
		position: sticky;
		top: 5rem;
		background-color: var(--clr-background-primary);
		padding: 1.4rem 0 1.5rem 0;
		// border-bottom: 1px var(--clr-neutral-900-t9) solid;
		backdrop-filter: blur(10px);

		span {
			font-size: var(--fs-300);
		}
	}
</style>
