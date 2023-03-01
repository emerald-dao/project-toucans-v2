<script type="ts">
	import { roundData } from '$components/round-generator/stores/RoundData';
	import type { FinancialDao } from '$lib/types/dao-project.interface';
	import type { FinancialDaoGeneratorData } from '$lib/types/generator/dao-generator-data.interface';
	import { newRoundActiveStep, newRoundSteps } from "$components/round-generator/stores/RoundSteps";
	import { Button, getModal, Modal } from "@emerald-dao/component-library";
	import Icon from "@iconify/svelte";
  import { Currencies } from '$lib/types/currencies.enum';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';

  export let daoData: FinancialDao | FinancialDaoGeneratorData;
  export let open = false;

  const dispatch = createEventDispatcher();
  
  // daoData can come in two types, FinancialDao and FinancialDaoGeneratorData
  // FinancialDao is the type that's used when Dao is already created and we want to create a new round from the admin
  // FinancialDaoGeneratorData is the type that is used when we are creating a new Dao from the generator
  // So we need to check the type we are receiving and gather the data we need (tokenSymbol, projectId, editDelay)
  // In the case of projectId and editDelay when we are creating a new Dao from the generator, we don't have them yet, so they will be undefined
  const tokenSymbol = "token_symbol" in daoData ? daoData.token_symbol : daoData.daoDetails.tokenName;
  const projectId = "project_id" in daoData ? daoData.project_id : undefined;
  const editDelay = "editDelay" in daoData ? daoData.editDelay : '0.0'; // TODO: check the correct way to get the editDelay

  // If we are creating a funding round for an existing DAO, we clean our store to receive a clean instance,
  // otherwise we keep the data we have in the store
  if ("project_id" in daoData) {
    roundData.set({
      infiniteDuration: false,
      infiniteFundingGoal: false,
      startDate: '',
      endDate: '',
      projectId: '',
      fundingGoal: undefined,
      currency: Currencies.FLOW,
      distributionList: [],
      issuanceRate: undefined,
      reserveRate: undefined
    });
    newRoundActiveStep.reset
  }

  // When the last step is completed, we close the modal
  $: if ($newRoundSteps[$newRoundSteps.length - 1].state === 'success') {
    if (getModal()) {
      getModal().close();
    }
  };

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
			this={$newRoundSteps[$newRoundActiveStep].component}
			tokenSymbol={tokenSymbol}
			projectId={projectId}
			editDelay={editDelay}
		/>
	</div>
</Modal>

<style type="scss">
	.round-modal-wrapper {
		width: 500px;
		height: 500px;
	}
</style>
