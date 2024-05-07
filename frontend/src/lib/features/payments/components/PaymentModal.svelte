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
			title: 'Purchase',
			icon: 'tabler:cash-banknote',
			action: () => initPayment('fund')
		},
		donate: {
			title: 'Donate',
			icon: 'tabler:heart-handshake',
			action: () => initPayment('donation')
		}
	};

	const PURCHASE_CONDITIONS = [
		{
			message: 'Please log in to purchase.',
			test: () => $user.loggedIn
		},
		{
			message: 'There is no active round.',
			test: () => daoData.onChainData.currentFundingCycle !== null
		},
		{
			message: 'The project owner has turned purchasing off.',
			test: () => daoData.onChainData.purchasing
		},
		{
			message: 'You do not own NFTs to donate.',
			test: async () => {
				if (daoData.onChainData.requiredNft) {
					await ownsNFTFromCatalog(
						$user.addr as string,
						daoData.onChainData.requiredNft.identifier
					);
				} else {
					return true;
				}
			}
		}
	];

	const checkActivePurchasing = async () => {
		if (paymentType === 'donate') {
			return null;
		} else {
			const failedCondition = PURCHASE_CONDITIONS.find((condition) => !condition.test());

			if (failedCondition) {
				return failedCondition.message;
			}
			return null;
		}
	};

	const initPayment = (paymentType: 'fund' | 'donation') => {
		paymentActiveStep.reset();

		getModal(id).open();

		$paymentData.type = paymentType;
		$paymentData.daoName = daoData.generalInfo.name;
		$paymentData.daoAddress = daoData.generalInfo.owner;
		$paymentData.contractAddress = daoData.generalInfo.contract_address;
		$paymentData.payerAddress = $user.addr as string;
		$paymentData.projectId = daoData.generalInfo.project_id;
		$paymentData.currency = daoData.onChainData.paymentCurrency;
		$paymentData.tokenName = daoData.generalInfo.token_symbol as string;

		if ($paymentData.type === 'fund') {
			$paymentData.issuanceRate = Number(
				daoData.onChainData.currentFundingCycle!.details.issuanceRate
			);
			$paymentData.reserveRate = Number(
				daoData.onChainData.currentFundingCycle!.details.reserveRate
			);
		} else if ($paymentData.type === 'donation') {
			$paymentData.daoTokenSymbol = daoData.generalInfo.token_symbol as string;
		}
	};

	let failedPurchasCondition: string | null = '';

	$: $user && checkActivePurchasing().then((res) => (failedPurchasCondition = res));
</script>

{#if !failedPurchasCondition}
	<Button
		size="large"
		width="full-width"
		on:click={PAYMENT_DATA[paymentType].action}
		state="active"
		type={paymentType === 'fund' ? 'generic' : 'ghost'}
		color={paymentType === 'fund' ? 'primary' : 'neutral'}
		{title}
	>
		<Icon icon={PAYMENT_DATA[paymentType].icon} />
		{PAYMENT_DATA[paymentType].title}
	</Button>
{:else}
	<div class="button-wrapper" data-tooltip={failedPurchasCondition}>
		<Button
			size="large"
			width="full-width"
			on:click={PAYMENT_DATA[paymentType].action}
			state="disabled"
			type={paymentType === 'fund' ? 'generic' : 'ghost'}
			color={paymentType === 'fund' ? 'primary' : 'neutral'}
			{title}
		>
			<Icon icon={PAYMENT_DATA[paymentType].icon} />
			{PAYMENT_DATA[paymentType].title}
		</Button>
	</div>
{/if}
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

<style lang="scss">
	.button-wrapper {
		width: 100%;
	}
</style>
