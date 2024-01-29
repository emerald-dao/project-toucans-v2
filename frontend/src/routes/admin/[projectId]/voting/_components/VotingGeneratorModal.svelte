<script type="ts">
	import { Button, getModal } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import StepsProcessModal from '$components/step-process-modal/StepsProcessModal.svelte';
	import { votingGeneratorActiveStep, votingGeneratorSteps } from './steps/steps';

	export let daoData: DAOProject;

	$: tokenSymbol = daoData.generalInfo.token_symbol;
	$: projectId = daoData.generalInfo.project_id;
	$: editDelay = daoData.onChainData.editDelay;

	const id = `voting-generator-${daoData.generalInfo.project_id}`;
</script>

<Button
	on:click={() => {
		getModal(id).open();
		votingGeneratorActiveStep.goToStep(0);
	}}
	width="extended"
>
	<Icon icon="tabler:plus" />
	Create Round
</Button>
<StepsProcessModal
	steps={$votingGeneratorSteps}
	activeStepStore={votingGeneratorActiveStep}
	heading="New round"
	icon="tabler:pig-money"
	{id}
>
	<svelte:component
		this={$votingGeneratorSteps[$votingGeneratorActiveStep].component}
		bind:isValid={$votingGeneratorSteps[$votingGeneratorActiveStep].isValid}
		{tokenSymbol}
		{projectId}
		{editDelay}
		{daoData}
	/>
</StepsProcessModal>
