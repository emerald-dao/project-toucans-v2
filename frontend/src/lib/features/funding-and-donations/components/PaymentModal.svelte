<script lang="ts">
	import { paymentData } from '$lib/features/funding-and-donations/stores/PaymentData';
	import { paymentActiveStep } from '$lib/features/funding-and-donations/stores/PaymentSteps';
	import { paymentSteps } from '$lib/features/funding-and-donations/stores/PaymentSteps';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button, getModal, Modal } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { user } from '$stores/flow/FlowStore';
	import { ECurrencies } from '$lib/types/common/enums';

	export let daoData: DAOProject;
	export let paymentType: 'fund' | 'donate';

	const initFunding = () => {
		paymentActiveStep.reset();

		getModal().open();

		$paymentData.type = 'fund';
		$paymentData.daoName = daoData.generalInfo.name;
		$paymentData.daoAddress = daoData.generalInfo.owner;
		$paymentData.payerAddress = $user.addr as string;
		$paymentData.projectId = daoData.generalInfo.project_id;
		$paymentData.currency = ECurrencies.FLOW;
		$paymentData.issuanceRate = Number(
			daoData.onChainData.fundingCycles[Number(daoData.onChainData.currentFundingCycle)].details
				.issuanceRate
		);
	};

	const initDonation = () => {
		paymentActiveStep.reset();

		getModal().open();

		$paymentData.type = 'donation';
		$paymentData.daoName = daoData.generalInfo.name;
		$paymentData.daoAddress = daoData.generalInfo.owner;
		$paymentData.payerAddress = $user.addr as string;
		$paymentData.projectId = daoData.generalInfo.project_id;
		$paymentData.currency = ECurrencies.FLOW;
	};
</script>

{#if paymentType === 'fund'}
	<Button size="large" width="full-width" on:click={initFunding}>
		<Icon icon="tabler:cash-banknote" />
		Fund
	</Button>
{:else if paymentType === 'donate'}
	<Button size="large" width="full-width" on:click={initDonation}>
		<Icon icon="tabler:heart-handshake" />
		Donate
	</Button>
{/if}
<Modal background="var(--clr-background-secondary)">
	<div class="modal-content">
		<svelte:component this={$paymentSteps[$paymentActiveStep].component} {daoData} {paymentType} />
	</div>
</Modal>

<style lang="scss">
	.modal-content {
		width: 420px;
		min-height: 280px;
		display: flex;
		overflow: hidden;
	}
</style>
