<script type="ts">
	import { newRoundActiveStep } from './../stores/RoundGeneratorSteps';
	import { Button, getModal } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { roundGeneratorData } from '../stores/RoundGeneratorData';
	import { roundGeneratorSteps } from '../stores/RoundGeneratorSteps';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import StepsProcessModal from '$components/step-process-modal/StepsProcessModal.svelte';

	export let daoData: DAOProject;

	$: tokenSymbol = daoData.generalInfo.token_symbol;
	$: projectId = daoData.generalInfo.project_id;
	$: editDelay = daoData.onChainData.editDelay;

	const id = `round-generator-${daoData.generalInfo.project_id}`;

	// If we are creating a funding round for an existing DAO, we clean our store to receive a clean instance,
	// otherwise we keep the data we have in the store
	roundGeneratorData.set({
		infiniteDuration: false,
		infiniteFundingGoal: false,
		startDate: '',
		endDate: '',
		projectId: '',
		fundingGoal: undefined,
		currency: daoData.onChainData.paymentCurrency,
		distributionList: [],
		issuanceRate: undefined,
		reserveRate: 0,
		allowOverflow: true,
		requiredNft: null
	});
	newRoundActiveStep.reset;
</script>

<Button
	on:click={() => {
		getModal(id).open();
		newRoundActiveStep.goToStep(0);
	}}
	width="extended"
>
	<Icon icon="tabler:plus" />
	Create Round
</Button>
<StepsProcessModal
	steps={$roundGeneratorSteps}
	activeStepStore={newRoundActiveStep}
	heading="New round"
	icon="tabler:pig-money"
	{id}
>
	<svelte:component
		this={$roundGeneratorSteps[$newRoundActiveStep].component}
		bind:isValid={$roundGeneratorSteps[$newRoundActiveStep].isValid}
		{tokenSymbol}
		{projectId}
		{editDelay}
		{daoData}
	/>
</StepsProcessModal>
