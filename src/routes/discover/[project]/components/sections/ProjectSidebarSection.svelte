<script type="ts">
	import { user } from '$stores/flow/FlowStore';
	import { Button, Label, Modal, getModal } from '@emerald-dao/component-library';
	import { fundSteps, fundActiveStep } from '$stores/fund/FundSteps';
	import { fundData } from '$stores/fund/FundDataStore';
	import Icon from '@iconify/svelte';
	import type { CommunityDao, FinancialDao } from '$lib/types/dao-project.interface';

	export let daoData: CommunityDao | FinancialDao;

	const initFunding = () => {
		fundActiveStep.reset();

		getModal().open();

		$fundData.daoName = daoData.name;
		$fundData.daoAddress = daoData.address;
		$fundData.funderAddress = $user.addr;
		// $fundData.issuanceRate = daoData.issuanceRate;
	};
</script>

<div class="card-primary column-10">
	<div class="column-10">
		<div class="row-4 align-center">
			<img src={daoData.logoUrl} alt="DAO Logo" />
			<h1 class="h3 w-medium">{daoData.name}</h1>
		</div>
		<div class="column-2">
			{#if daoData.socials.twitter || daoData.socials.discord || daoData.socials.website}
				<div class="row-4">
					{#if daoData.socials.twitter}
						<a href="twitter" class="header-link" target="_blank">
							<Icon icon="tabler:brand-twitter" width="24" />
						</a>
					{/if}
					{#if daoData.socials.discord}
						<a href="discord" class="header-link" target="_blank">
							<Icon icon="tabler:brand-discord" width="24" />
						</a>
					{/if}
					{#if daoData.socials.website}
						<a href="website" class="header-link" target="_blank">
							<Icon icon="tabler:world" width="24" />
						</a>
					{/if}
				</div>
			{/if}
			{#if daoData.tags.length > 0}
				<div class="row-3">
					{#each daoData.tags as tag}
						<Label color="neutral" size="x-small">{tag}</Label>
					{/each}
				</div>
			{/if}
		</div>
		<p class="small">{daoData.description}s</p>
	</div>
	<Button size="full-width" on:click={initFunding}><Icon icon="tabler:cash-banknote" />Fund</Button>
</div>
<Modal>
	<div class="modal-content">
		<svelte:component this={$fundSteps[$fundActiveStep].component} />
	</div>
</Modal>

<style type="scss">
	.card-primary {
		height: fit-content;
		padding: var(--space-10);

		img {
			max-width: 80px;
			aspect-ratio: 1 / 1;
			object-fit: contain;
		}

		.header-link {
			font-size: var(--font-size-3);
		}
	}

	.modal-content {
		max-width: 300px;
	}
</style>
