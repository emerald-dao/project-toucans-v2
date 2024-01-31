<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button, Label } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import SubscribeButton from '../atoms/SubscribeButton.svelte';
	import PaymentModal from '$lib/features/payments/components/PaymentModal.svelte';
	import TreasuryWallet from '../../../../admin/[projectId]/_components/stats-blocks/TreasuryWallet.svelte';
	import RequiredNft from './atoms/RequiredNft.svelte';
	import { user } from '$stores/flow/FlowStore';
	import { currencies } from '$stores/flow/TokenStore';
	import { handleBannerImgError, handleLogoImgError } from '$lib/utilities/handleLogoImgError';

	export let daoData: DAOProject;
</script>

<aside class="column-8">
	<div class="card-primary column">
		{#if daoData.generalInfo.banner_image}
			<img
				src={daoData.generalInfo.banner_image}
				on:error={(e) => handleBannerImgError(e)}
				alt="Background illustration"
				class="banner-image"
			/>
		{:else}
			<img
				src="/toucans-illustration.png"
				alt="Default background illustration"
				class="banner-image"
			/>
		{/if}
		<div class="content-wrapper column">
			<div class="column-4">
				<img
					src={daoData.generalInfo.logo}
					on:error={(e) => handleLogoImgError(e)}
					alt="DAO Logo"
					class="dao-logo"
				/>
				<div class="commands-wrapper row-2 align-center">
					{#if daoData.generalInfo.owner === $user.addr || ($user.addr && daoData.onChainData.signers.includes($user.addr))}
						<Button
							size="x-small"
							color="neutral"
							type="ghost"
							href={`/admin/${daoData.generalInfo.project_id}`}>Manage DAO</Button
						>
					{/if}
					<!-- {#if daoData.hasToken && daoData.onChainData.minting}
						<Label size="xx-small" color="neutral" hasBorder={false} iconRight="tabler:check">
							Minting
						</Label>
					{/if} -->
					{#if $user.loggedIn}
						<SubscribeButton
							projectId={daoData.generalInfo.project_id}
							projectOwner={daoData.generalInfo.owner}
						/>
					{/if}
				</div>
				<h1 class="h3 w-medium">{daoData.generalInfo.name}</h1>
				{#if daoData.hasToken || daoData.generalInfo.twitter || daoData.generalInfo.discord || daoData.generalInfo.website}
					<div class="row-3 align-end">
						{#if daoData.hasToken}
							<Label size="small" color="tertiary" hasBorder={false}
								>{`$${daoData.generalInfo.token_symbol}`}</Label
							>
						{/if}
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
									href={`https://discord.gg/${daoData.generalInfo.discord}`}
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
						{#if daoData.hasToken && daoData.onChainData.trading}
							<a
								href={`https://app.increment.fi/swap?in=A.${currencies[
									daoData.onChainData.paymentCurrency
								].contractAddress.slice(2)}.${
									currencies[daoData.onChainData.paymentCurrency].contractName
								}&out=A.${daoData.generalInfo.contract_address.slice(2)}.${
									daoData.generalInfo.project_id
								}`}
								target="_blank"
								class="trading-link header-link"
								rel="noreferrer"
							>
								<img src="/incrementfi.ico" alt="Incrementfi Logo" width="12" />
								Trade token
								<Icon icon="tabler:external-link" width="12" />
							</a>
						{/if}
					</div>
				{/if}
				<p class="small description">{daoData.generalInfo.description}</p>
			</div>
			<div class="column-5">
				<div class="payment-buttons-wrapper">
					{#if daoData.hasToken}
						<PaymentModal {daoData} paymentType="fund" />
					{/if}
					<PaymentModal {daoData} paymentType="donate" />
				</div>
				{#if daoData.hasToken}
					<p class="payment-explanation">
						{`By purchasing this project you will get $${daoData.generalInfo.token_symbol} tokens in the rate specified in the current funding cycle.`}
					</p>
				{/if}
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
		border: none;
		padding: 0;

		.banner-image {
			position: relative;
			width: 100%;
			height: 120px;
			object-fit: cover;
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
				background-color: var(--clr-surface-primary);
			}

			.commands-wrapper {
				position: absolute;
				top: var(--space-4);
				right: 0;
			}

			.trading-link {
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: var(--space-1);
				font-size: var(--font-size-1) !important;
				margin-left: var(--space-2);
				margin-bottom: 2px;
			}

			.header-link {
				font-size: var(--font-size-3);
			}

			p.description {
				margin-bottom: var(--space-11);
			}

			.payment-buttons-wrapper {
				display: flex;
				flex-direction: column;
				gap: var(--space-4);

				@include mq('small') {
					flex-direction: row;
				}
			}

			.payment-explanation {
				font-size: 0.65rem;
				line-height: normal;
			}
		}
	}
</style>
