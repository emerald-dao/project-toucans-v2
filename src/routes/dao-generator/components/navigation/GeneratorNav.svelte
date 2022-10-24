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
				<Ball status={step.state} width={1.8} />
			</Column>
		{/each}
	</Row>
</nav>

<style type="scss">
	nav {
		position: sticky;
		top: -1.2rem;
		background-color: var(--clr-background-secondary-t5);
		padding-block: 2.6rem 1.8rem;
		border-bottom: 1px var(--clr-neutral-900-t9) solid;
		backdrop-filter: blur(20px);
		z-index: 1;

		span {
			font-size: var(--fs-300);
			--font-weight: 500;
		}
	}
</style>
