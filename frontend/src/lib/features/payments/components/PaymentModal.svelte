<script lang="ts">
	import { paymentData } from '$lib/features/payments/stores/PaymentData';
	import { paymentActiveStep } from '$lib/features/payments/stores/PaymentSteps';
	import { paymentSteps } from '$lib/features/payments/stores/PaymentSteps';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button, getModal } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { user } from '$stores/flow/FlowStore';
	import StepsProcessModal from '$components/step-process-modal/StepsProcessModal.svelte';
	import { ownsNFTFromCatalog } from '$flow/actions';

	export let daoData: DAOProject;
	export let paymentType: 'fund' | 'donate';

	const id = `${paymentType}-${daoData.generalInfo.project_id}`;
	let title = '';

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
		$paymentData.currency = daoData.onChainData.paymentCurrency;
		$paymentData.tokenName = daoData.generalInfo.token_symbol;

		if ($paymentData.type === 'fund') {
			$paymentData.issuanceRate = Number(
				daoData.onChainData.currentFundingCycle!.details.issuanceRate
			);
			$paymentData.reserveRate = Number(
				daoData.onChainData.currentFundingCycle!.details.reserveRate
			);
		} else if ($paymentData.type === 'donation') {
			$paymentData.daoTokenSymbol = daoData.generalInfo.token_symbol;
		}
	};

	const active = async () => {
		if (paymentType === 'donate' || !daoData.onChainData.requiredNft) {
			return true;
		}
		if (!daoData.onChainData.purchasing) {
			title = 'The project owner has turned funding off.';
			return false;
		}
		if (!$user.loggedIn) {
			title = 'Please log in to fund.';
			return false;
		}

		const owns = await ownsNFTFromCatalog(
			$user.addr as string,
			daoData.onChainData.requiredNft.identifier
		);
		if (!owns) {
			title = 'You do not own the required NFT to fund.';
			return false;
		}
		return true;
	};

	$: $user.loggedIn && active();
</script>

{#await active() then active}
	<Button
		size="large"
		width="full-width"
		on:click={PAYMENT_DATA[paymentType].action}
		state={active ? 'active' : 'disabled'}
		{title}
	>
		<Icon icon={PAYMENT_DATA[paymentType].icon} />
		{PAYMENT_DATA[paymentType].title}
	</Button>
{/await}
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
