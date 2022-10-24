<script type="ts">
	import { user } from '$stores/flow/FlowStore';
	import { Card } from '$components/atoms';
	import Modal, { getModal } from '$components/atoms/Modal.svelte';
	import { Column, Row } from '@mateoroldos/svelte.bones';
	import { Button } from '@emerald-dao/component-library';
	import { fundSteps, fundActiveStep } from '$stores/fund/FundSteps';
	import { fundData } from '$stores/fund/FundDataStore';

	export let daoData = {
		name: 'Emerald City DAO',
		address: '0x3fewqnj35',
		website: 'ecdao.org',
		date: '10/10/2022',
		founder: 'Jacob Tucker',
		currency: 'EMLD',
		issuanceRate: 23,
		descirption:
			'Enim veniam veniam ex ut eiusmod adipisicing cillum nulla excepteur. Ullamco deserunt Lorem non quis. Dolor dolore voluptate non tempor est non aliquip officia Lorem nulla cupidatat enim excepteur. Non proident pariatur minim anim. Adipisicing reprehenderit elit dolor eiusmod do enim fugiat.'
	};

	const initFunding = () => {
		fundActiveStep.reset();

		getModal().open();

		$fundData.daoName = daoData.name;
		$fundData.daoAddress = daoData.address;
		$fundData.funderAddress = $user.addr;
		$fundData.issuanceRate = daoData.issuanceRate;
	};
</script>

<Card padding={2}>
	<Column gap="small" align="flex-start">
		<h1>{daoData.name}</h1>
		<span>{daoData.website}</span>
		<Row gap={1} justify="space-between">
			<span class="data-card">{daoData.date}</span>
			<span class="data-card">{daoData.founder}</span>
			<span class="data-card">{`$ ${daoData.currency}`}</span>
		</Row>
		<p>{daoData.descirption}s</p>
		<Button size="full-width" on:click={initFunding}>FUND</Button>
	</Column>
	<Modal>
		<div class="modal-content">
			<svelte:component this={$fundSteps[$fundActiveStep].component} />
		</div>
	</Modal>
</Card>

<style type="scss">
	h1 {
		font-size: var(--fs-600);
	}

	.data-card {
		font-size: var(--fs-200);
		background-color: var(--clr-neutral-900-t9);
		padding: 0.4em;
		border-radius: 0.2rem;
	}

	p {
		font-size: var(--fs-300);
	}

	.modal-content {
		max-width: 25ch;
	}
</style>
