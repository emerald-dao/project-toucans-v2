<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button, Label, TooltipIcon } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import SubscribeButton from '../atoms/SubscribeButton.svelte';
	import PaymentModal from '$lib/features/payments/components/PaymentModal.svelte';
	import TreasuryWallet from '../../../../admin/_components/stats-blocks/TreasuryWallet.svelte';
	import RequiredNft from './atoms/RequiredNft.svelte';
	import { setUpVaultExecution } from '$flow/actions';
	import { user } from '$stores/flow/FlowStore';

	export let daoData: DAOProject;
	async function setUpVault() {
		await setUpVaultExecution(daoData.generalInfo.project_id, daoData.generalInfo.contract_address);
		daoData.vaultSetup = true;
	}
</script>

<aside class="column-7">
	<div class="card-primary column">
		<img
			src={daoData.generalInfo.banner_image}
			alt="Background illustration"
			class="banner-image"
		/>
		<div class="content-wrapper column">
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
				<h1 class="h3 w-medium">{daoData.generalInfo.name}</h1>
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
							{#if daoData.generalInfo.discord}
								<a
									href={`https://discord.gg/invite/${daoData.generalInfo.discord}`}
									rel="noreferrer"
									class="header-link"
									target="_blank"
								>
									<Icon icon="tabler:brand-discord" width="16" />
								</a>
							{/if}
							{#if daoData.generalInfo.website}
								<a
									href={`https://${daoData.generalInfo.website}`}
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
				<p class="small description">{daoData.generalInfo.description}</p>
			</div>
			<div class="column-5">
				{#if !daoData.vaultSetup && $user.loggedIn}
					<Button
						size="large"
						width="full-width"
						on:click={setUpVault}
						title={'Enable Vault'}
						type="ghost"
						color="neutral"
					>
						<Icon icon="tabler:circle-arrow-up" />
						Set Up Vault
					</Button>
				{/if}
				<div class="row-4">
					{#if daoData.onChainData.currentFundingCycle}
						<PaymentModal {daoData} paymentType="fund" />
					{/if}
					<PaymentModal {daoData} paymentType="donate" />
				</div>
				{#if daoData.onChainData.requiredNft != null}
					<RequiredNft nft={daoData.onChainData.requiredNft} />
				{/if}
			</div>
		</div>
	</div>
	<TreasuryWallet {daoData} color="neutral" />
</aside>

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

			p.description {
				margin-bottom: var(--space-11);
			}
		}
	}
</style>
