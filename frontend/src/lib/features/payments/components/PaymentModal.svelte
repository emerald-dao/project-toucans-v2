<script lang="ts">
	import { paymentData } from '$lib/features/payments/stores/PaymentData';
	import { paymentActiveStep } from '$lib/features/payments/stores/PaymentSteps';
	import { paymentSteps } from '$lib/features/payments/stores/PaymentSteps';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button, getModal, Modal } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { user } from '$stores/flow/FlowStore';
	import { ECurrencies } from '$lib/types/common/enums';
	import StepsProcessModal from '$components/step-process-modal/StepsProcessModal.svelte';

	export let daoData: DAOProject;
	export let paymentType: 'fund' | 'donate';

	const id = `${paymentType}-${daoData.generalInfo.project_id}`;

	const PAYMENT_DATA = {
		fund: {
			title: 'Fund',
			icon: 'tabler:cash-banknote',
			action: () => initPayment('fund')
		},
		donate: {
			title: 'Donate',
			icon: 'tabler:heart-handshake',
			action: () => initPayment('donation')
		}
	};

	const initPayment = (paymentType: 'fund' | 'donation') => {
		paymentActiveStep.reset();

		getModal(id).open();

		$paymentData.type = paymentType;
		$paymentData.daoName = daoData.generalInfo.name;
		$paymentData.daoAddress = daoData.generalInfo.owner;
		$paymentData.payerAddress = $user.addr as string;
		$paymentData.projectId = daoData.generalInfo.project_id;
		$paymentData.currency = ECurrencies.FLOW;

		if ($paymentData.type === 'fund') {
			$paymentData.issuanceRate = Number(
				daoData.onChainData.fundingCycles[Number(daoData.onChainData.currentFundingCycle)].details
					.issuanceRate
			);
		}
	};
</script>

<Button size="large" width="full-width" on:click={PAYMENT_DATA[paymentType].action}>
	<Icon icon={PAYMENT_DATA[paymentType].icon} />
	{PAYMENT_DATA[paymentType].title}
</Button>
<StepsProcessModal
	steps={$paymentSteps}
	activeStepStore={paymentActiveStep}
	heading={PAYMENT_DATA[paymentType].title}
	icon={PAYMENT_DATA[paymentType].icon}
	{id}
>
	<svelte:component
		this={$paymentSteps[$paymentActiveStep].component}
		bind:isValid={$paymentSteps[$paymentActiveStep].isValid}
		{daoData}
		{paymentType}
	/>
</StepsProcessModal>