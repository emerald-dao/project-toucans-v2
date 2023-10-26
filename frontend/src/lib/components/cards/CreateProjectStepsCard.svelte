<script type="ts">
	import { goto } from '$app/navigation';
	import { daoGeneratorSteps } from '$lib/features/dao-generator/stores/DaoGeneratorSteps';
	import { Button, ProgressSteps } from '@emerald-dao/component-library';

	const steps = [...$daoGeneratorSteps];

	const deactivateSteps = () => {
		for (let index = 0; index < steps.length; index++) {
			steps[index].state = 'inactive';
		}
	};

	export const activateStep = (i: number) => {
		steps[i].state = 'active';

		for (let index = 0; index < steps.length; index++) {
			if (i > index) {
				steps[index].state = 'success';
			}
			if (i < index) {
				steps[index].state = 'inactive';
			}
		}
	};

	export let activeStep: number | undefined = undefined;

	$: activeStep === undefined ? deactivateSteps() : activateStep(activeStep);
</script>

<div class="card-primary column-7">
	<h5 class="w-medium">Launch your DAO</h5>
	<ProgressSteps {steps} direction="column-reverse" gap={1.4} />
	<div>
		<Button width="full-width" href="/dao-generator">Create DAO</Button>
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
