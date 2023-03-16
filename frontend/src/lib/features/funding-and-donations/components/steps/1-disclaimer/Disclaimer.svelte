<script type="ts">
	import StepTitle from './../../atoms/StepTitle.svelte';
	import { Button } from '@emerald-dao/component-library';
	import { paymentActiveStep } from '$lib/features/funding-and-donations/stores/PaymentSteps';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;
</script>

<div class="main-wrapper">
	<div class="column-4 align-center">
		<StepTitle {daoData} />
		<p class="small">
			By agreeing to fund this project, you are instilling trust upon this project. Toucans is not
			responsible for funds lost or stolen, or any losses by projects or their supporters.
		</p>
	</div>
	<Button on:click={paymentActiveStep.increment} width="full-width" size="large">Accept</Button>
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		text-align: center;

		p {
			margin-bottom: var(--space-10);
		}
	}
</style>
