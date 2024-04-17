<script lang="ts">
	import { Label, StatusCircle, AlertNumber } from '@emerald-dao/component-library';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import Icon from '@iconify/svelte';
	import { handleLogoImgError } from '$lib/utilities/handleLogoImgError';

	export let daoData: DAOProject;
	export let showAdminButtons = true;
</script>

<div class="main-wrapper">
	<div class="row-3 align-center">
		<img src={daoData.generalInfo.logo} on:error={(e) => handleLogoImgError(e)} alt="dao-logo" />
		<div class="row-2 name-wrapper">
			<h2>{daoData.generalInfo.name}</h2>
			<a
				href={`/p/${daoData.generalInfo.project_id}`}
				target="_blank"
				class="header-link"
				rel="noreferrer"
			>
				<Icon icon="tabler:external-link" />
			</a>
		</div>
		{#if daoData.hasToken}
			<Label color="tertiary" size="x-small" hasBorder={false}>
				{`$${daoData.generalInfo.token_symbol}`}
			</Label>
		{/if}
	</div>
	{#if showAdminButtons}
		<div class="row-6">
			<div class="row-2 align-center">
				{#if daoData.onChainData.currentFundingCycle}
					<a href={`/admin/${daoData.generalInfo.project_id}/rounds`} class="rounds-link header-link">
						<StatusCircle status="success" width="0.5rem" />
						Active Funding Round
					</a>
				{:else if daoData.hasToken}
					<a href={`/admin/${daoData.generalInfo.project_id}/rounds`} class="rounds-link header-link">
						<StatusCircle status="alert" width="0.5rem" />
						No Active Funding Round
					</a>
				{/if}
			</div>
			<a class="pending-actions" href={`/admin/${daoData.generalInfo.project_id}/actions`}>
				<div class="alert-number-wrapper">
					<AlertNumber number={Number(daoData.onChainData.actions.length)} />
				</div>
				<IconCircle icon="tabler:layout-list" color="primary" />
			</a>
		</div>
	{/if}
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: row;
		gap: var(--space-4);
		align-items: center;
		justify-content: space-between;
		padding-bottom: var(--space-4);
		border-radius: var(--radius-6);

		.name-wrapper {
			align-items: baseline;

			h2 {
				font-size: var(--font-size-4);
			}
		}

		img {
			width: 40px;
			height: 40px;
			border-radius: var(--radius-6);
			object-fit: cover;
		}

		.rounds-link {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: var(--space-2);
			text-decoration: none;
			font-size: var(--font-size-0);
		}

		.pending-actions {
			position: relative;
			text-decoration: none;
			color: var(--clr-heading-inverse);

			.alert-number-wrapper {
				top: -4px;
				right: -4px;
				position: absolute;
			}
		}
	}
</style>
