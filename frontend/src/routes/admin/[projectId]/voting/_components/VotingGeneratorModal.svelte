<script type="ts">
	import { Button, getModal } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import StepsProcessModal from '$components/step-process-modal/StepsProcessModal.svelte';
	import { setContext } from 'svelte';
	import { votingGeneratorActiveStep, votingGeneratorSteps } from '../_config/votingGeneratorSteps';
	import { resetVotingGeneratorStores } from '../_config/votingGeneratorData';

	export let daoData: DAOProject;

	$: tokenSymbol = daoData.generalInfo.token_symbol;
	$: projectId = daoData.generalInfo.project_id;
	$: editDelay = daoData.onChainData.editDelay;

	const id = `voting-generator-${daoData.generalInfo.project_id}`;

	let isOpen = false;

	setContext('activeDao', daoData);
</script>

<Button
	on:click={() => {
		resetVotingGeneratorStores();
		votingGeneratorActiveStep.goToStep(0);
		getModal(id).open();
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
