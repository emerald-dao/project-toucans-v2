<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button, Label, TooltipIcon } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import SubscribeButton from '../atoms/SubscribeButton.svelte';
	import PaymentModal from '$lib/features/funding-and-donations/components/PaymentModal.svelte';

	export let daoData: DAOProject;

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
				<PaymentModal {daoData} paymentType="fund" />
				<PaymentModal {daoData} paymentType="donate" />
			</div>
		{:else}
			<PaymentModal {daoData} paymentType="donate" />
		{/if}
	</div>
</div>

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
</style>
