<script type="ts">
	import { generatorSteps } from '$stores/generator/GeneratorSteps';
	import { Button, ProgressSteps } from '@emerald-dao/component-library';
</script>

<div class="card-primary column-7">
	<h5 class="w-medium">Launch your DAO</h5>
	<ProgressSteps steps={$generatorSteps} direction="column-reverse" gap={1.4} />
	<div>
		<Button size="full-width" href="/dao-generator/generate">Create DAO</Button>
		<span>By clicking above you are agreeing to our Terms & Conditions</span>
	</div>
</div>

<style type="scss">
	.card-primary {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: fit-content;
		padding: var(--space-10);

		h5 {
			margin: 0;
		}

		span {
			font-size: 0.6rem;
		}
	}
</style>
