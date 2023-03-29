<script lang="ts">
	import StepsProcessModal from '$components/step-process-modal/StepsProcessModal.svelte';
	import { Button, getModal } from '@emerald-dao/component-library';
	import { holderClaimActiveStep, holderClaimSteps } from '../stores/holderClaimStores';

	export let projectId: string;

	const id = `holder-claim-${projectId}`;

	const initClaim = () => {
		holderClaimActiveStep.reset();

		getModal(id).open();
	};
</script>

<Button size="x-small" color="neutral" type="ghost" on:click={initClaim}>Claim overflow</Button>
<StepsProcessModal
	steps={$holderClaimSteps}
	activeStepStore={holderClaimActiveStep}
	heading="Overflow claim"
	icon="tabler:bell-ringing"
	description="When funding rounds get overfunded, all token holders can exchange their tokens for part of the overflow."
	{id}
>
	<svelte:component
		this={$holderClaimSteps[$holderClaimActiveStep].component}
		bind:isValid={$holderClaimSteps[$holderClaimActiveStep].isValid}
	/>
</StepsProcessModal>
