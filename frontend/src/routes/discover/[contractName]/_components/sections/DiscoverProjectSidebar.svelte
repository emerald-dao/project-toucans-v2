<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { user } from '$stores/flow/FlowStore';
	import { Button, Label, Modal, getModal, TooltipIcon } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { ECurrencies } from '$lib/types/common/enums';
	import { fundingData } from '$lib/features/funding/stores/FundingData';
	import { fundActiveStep, fundingSteps } from '$lib/features/funding/stores/FundingSteps';
	import SubscribeButton from '../atoms/SubscribeButton.svelte';

	export let daoData: DAOProject;

	const initFunding = () => {
		if (daoData.onChainData.fundingCycles != undefined && $user) {
			fundActiveStep.reset();

			getModal().open();

			$fundingData.daoName = daoData.generalInfo.name;
			$fundingData.daoAddress = daoData.generalInfo.owner;
			$fundingData.funderAddress = $user.addr;
			$fundingData.projectId = daoData.generalInfo.project_id;
			$fundingData.currency = ECurrencies.FLOW;
			$fundingData.issuanceRate = Math.trunc(
				Number(
					daoData.onChainData.fundingCycles[
						Number(daoData.onChainData.fundingCycles[daoData.onChainData.fundingCycles.length - 1])
					].details.issuanceRate
				)
			);
		}
	};

	const initDonation = () => {
		alert('todo');
	};
</script>

<div class="card-primary column">
	<img src="/toucans-illustration.png" alt="Background illustration" class="banner-image" />
	<div class="content-wrapper column-14">
		<div class="column-4">
			<img src={daoData.generalInfo.logo} alt="DAO Logo" class="dao-logo" />
			<div class="commands-wrapper row-2 align-center">
				{#if daoData.onChainData.minting}
					<Label size="xx-small" color="neutral" hasBorder={false}>
						Minting enabled
						<TooltipIcon
							width={0.6}
							tooltip={`Project signers can mint $${daoData.generalInfo.token_symbol}`}
							backgroundColor="var(--clr-neutral-badge)"
							borderColor="var(--clr-neutral-badge)"
						/>
					</Label>
				{/if}
				<SubscribeButton
					projectId={daoData.generalInfo.project_id}
					projectOwner={daoData.generalInfo.owner}
				/>
			</div>
			<h1 class="h2 w-medium">{daoData.generalInfo.name}</h1>
			{#if daoData.generalInfo.twitter || daoData.generalInfo.discord || daoData.generalInfo.website}
				<div class="row-3 align-end">
					<Label size="small" color="tertiary" hasBorder={false}
						>{`$${daoData.generalInfo.token_symbol}`}</Label
					>
					<div class="row-2 align-end">
						{#if daoData.generalInfo.twitter}
							<a
								href={`https://twitter.com/${daoData.generalInfo.twitter}`}
								rel="noreferrer"
								class="header-link"
								target="_blank"
							>
								<Icon icon="tabler:brand-twitter" width="16" />
							</a>
						{/if}
						{#if daoData.generalInfo.discord && daoData.generalInfo.discord != 'https://discord.gg/'}
							<a
								href={daoData.generalInfo.discord}
								rel="noreferrer"
								class="header-link"
								target="_blank"
							>
								<Icon icon="tabler:brand-discord" width="16" />
							</a>
						{/if}
						{#if daoData.generalInfo.website}
							<a
								href={daoData.generalInfo.website}
								rel="noreferrer"
								class="header-link"
								target="_blank"
							>
								<Icon icon="tabler:world" width="16" />
							</a>
						{/if}
					</div>
				</div>
			{/if}
			<p class="small">{daoData.generalInfo.description}</p>
		</div>
		{#if daoData.onChainData.currentFundingCycle}
			<div class="row-4">
				<Button size="large" width="full-width" on:click={initFunding}>
					<Icon icon="tabler:cash-banknote" />
					Fund
				</Button>
				<Button size="large" type="ghost" color="neutral" on:click={initDonation}>
					<Icon icon="tabler:heart-handshake" />
					Donate
				</Button>
			</div>
		{:else}
			<Button size="large" width="full-width" on:click={initDonation}>
				<Icon icon="tabler:heart-handshake" />
				Donate
			</Button>
		{/if}
	</div>
</div>
<Modal>
	<div class="modal-content">
		<svelte:component this={$fundingSteps[$fundActiveStep].component} />
	</div>
</Modal>

<style type="scss">
	.card-primary {
		height: fit-content;
		padding: 0;

		.banner-image {
			position: relative;
			width: 100%;
			height: 120px;
			object-fit: cover;
			opacity: 0.7;
			border-bottom: 1px var(--clr-border-primary) solid;
			border-radius: var(--radius-4) var(--radius-4) 0 0;
		}

		.content-wrapper {
			margin: 0 var(--space-10) var(--space-10) var(--space-10);
			z-index: 2;
			position: relative;

			.dao-logo {
				width: 130px;
				aspect-ratio: 1 / 1;
				object-fit: cover;
				border-radius: var(--radius-2);
				border: 1px var(--clr-border-primary) solid;
				margin-top: -70px;
				background-color: var(--clr-surface-secondary);
			}

			.commands-wrapper {
				position: absolute;
				top: var(--space-4);
				right: 0;
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
