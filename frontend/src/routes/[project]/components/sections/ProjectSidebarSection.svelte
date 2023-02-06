<script type="ts">
	import { user } from '$stores/flow/FlowStore';
	import { Button, Label, Modal, getModal } from '@emerald-dao/component-library';
	import { fundSteps, fundActiveStep } from '$stores/fund/FundSteps';
	import { fundData } from '$stores/fund/FundDataStore';
	import Icon from '@iconify/svelte';
	import type { CommunityDao, FinancialDao } from '$lib/types/dao-project.interface';
	import { DaoType } from '$lib/types/dao-project.interface';
	import { Currencies } from '$lib/types/currencies.enum';

	export let daoData: FinancialDao | CommunityDao;

	const initFunding = () => {
		if (daoData.type === DaoType.Financial && $user) {
			fundActiveStep.reset();

			getModal().open();

			const dao = daoData as FinancialDao;

			$fundData.daoName = dao.name;
			$fundData.daoAddress = dao.owner;
			$fundData.funderAddress = $user.addr;
			$fundData.contractName = dao.contract_name;
			$fundData.currency = Currencies.FLOW;
			$fundData.issuanceRate = Math.trunc(
				Number(dao.fundingCycles[Number(dao.currentFundingCycle)].details.issuanceRate)
			);
			// $fundData.issuanceRate = daoData.issuanceRate;
		}
	};
</script>

<div class="card-primary column">
	<img src="/toucans-illustration.png" alt="Background illustration" class="banner-image" />
	<div class="content-wrapper column-14">
		<div class="column-4">
			<img src={daoData.logo} alt="DAO Logo" class="dao-logo" />
			<h1 class="h3 w-medium">{daoData.name}</h1>
			{#if daoData.twitter || daoData.discord || daoData.website}
				<div class="row-3 align-end">
					<Label size="small" color="tertiary">{`$${daoData.token_symbol}`}</Label>
					<div class="row-2 align-end">
						{#if daoData.twitter}
							<a
								href={`https://twitter.com/${daoData.twitter}`}
								rel="noreferrer"
								class="header-link"
								target="_blank"
							>
								<Icon icon="tabler:brand-twitter" width="18" />
							</a>
						{/if}
						{#if daoData.discord}
							<a href={daoData.discord} rel="noreferrer" class="header-link" target="_blank">
								<Icon icon="tabler:brand-discord" width="18" />
							</a>
						{/if}
						{#if daoData.website}
							<a href={daoData.website} rel="noreferrer" class="header-link" target="_blank">
								<Icon icon="tabler:world" width="18" />
							</a>
						{/if}
					</div>
				</div>
			{/if}
			<p class="small">{daoData.description}</p>
		</div>
		{#if daoData.type === DaoType.Financial}
			<Button size="large" width="full-width" on:click={initFunding}
				><Icon icon="tabler:cash-banknote" />
				Fund
			</Button>
		{/if}
	</div>
</div>
<Modal>
	<div class="modal-content">
		<svelte:component this={$fundSteps[$fundActiveStep].component} />
	</div>
</Modal>

<style type="scss">
	.card-primary {
		height: fit-content;
		padding: 0;
		overflow: hidden;

		.banner-image {
			position: relative;
			width: 100%;
			height: 120px;
			object-fit: cover;
			opacity: 0.7;
			border-bottom: 1px var(--clr-border-primary) solid;
		}

		.content-wrapper {
			padding: 0 var(--space-10) var(--space-10) var(--space-10);
			margin-top: -70px;
			z-index: 2;

			.dao-logo {
				width: 130px;
				aspect-ratio: 1 / 1;
				object-fit: contain;
				border-radius: var(--radius-2);
				border: 1px var(--clr-border-primary) solid;
			}

			.header-link {
				font-size: var(--font-size-3);
			}
		}
	}

	.modal-content {
		max-width: 300px;
	}
</style>
