<script type="ts">
	import { daoGeneratorSteps } from '$lib/features/dao-generator/stores/DaoGeneratorSteps';
	import { ProgressSteps } from '@emerald-dao/component-library';
</script>

<nav>
	<div class="row">
		<ProgressSteps steps={$daoGeneratorSteps} gap={8} />
	</div>
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
		display: flex;
		justify-content: center;
	}
</style>
