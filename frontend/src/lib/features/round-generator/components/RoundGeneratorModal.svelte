<script type="ts">
	import { newRoundActiveStep } from './../stores/RoundGeneratorSteps';
	import { Button, getModal, Modal } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import { roundGeneratorData } from '../stores/RoundGeneratorData';
	import { roundGeneratorSteps } from '../stores/RoundGeneratorSteps';
	import { ECurrencies } from '$lib/types/common/enums';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;
	export let open = false;

	const dispatch = createEventDispatcher();

	const tokenSymbol = daoData.generalInfo.token_symbol;
	const projectId = daoData.generalInfo.project_id;
	const editDelay = daoData.onChainData.editDelay;

	// If we are creating a funding round for an existing DAO, we clean our store to receive a clean instance,
	// otherwise we keep the data we have in the store
	roundGeneratorData.set({
		infiniteDuration: false,
		infiniteFundingGoal: false,
		startDate: '',
		endDate: '',
		projectId: '',
		fundingGoal: undefined,
		currency: ECurrencies.FLOW,
		distributionList: [],
		issuanceRate: undefined,
		reserveRate: undefined
	});
	newRoundActiveStep.reset;

	// When the last step is completed, we close the modal
	$: if ($roundGeneratorSteps[$roundGeneratorSteps.length - 1].state === 'success') {
		if (getModal()) {
			getModal().close();
		}
	}

	// If the open prop comes as true, the modal starts open
	onMount(() => {
		if (open) {
			getModal().open(() => dispatch('close'));
			newRoundActiveStep.reset();
		}
	});
</script>

<Button
	on:click={() => {
		getModal().open();
		newRoundActiveStep.goToStep(0);
	}}
	width="extended"
>
	<Icon icon="tabler:plus" />
	Create Round
</Button>
<Modal>
	<div class="round-modal-wrapper">
		<svelte:component
			this={$roundGeneratorSteps[$newRoundActiveStep].component}
			{tokenSymbol}
			{projectId}
			{editDelay}
		/>
	</div>
</Modal>

<style type="scss">
	.round-modal-wrapper {
		width: 500px;
		height: 500px;
	}
</style>
