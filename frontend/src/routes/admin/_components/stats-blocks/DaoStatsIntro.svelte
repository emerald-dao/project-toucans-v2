<script lang="ts">
	import { Label, StatusCircle } from '@emerald-dao/component-library';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import Icon from '@iconify/svelte';

	export let daoData: DAOProject;
</script>

<div class="main-wrapper">
	<div class="row-3 align-center">
		<img src={daoData.generalInfo.logo} alt="dao-logo" />
		<div class="row-2 name-wrapper">
			<h2>{daoData.generalInfo.name}</h2>
			<a
				href={`/discover/${daoData.generalInfo.project_id}`}
				target="_blank"
				class="header-link"
				rel="noreferrer"
			>
				<Icon icon="tabler:external-link" />
			</a>
		</div>
		<Label color="tertiary" size="x-small" hasBorder={false}>
			{`$${daoData.generalInfo.token_symbol}`}
		</Label>
	</div>
	<div class="row-6">
		<div class="row-2 align-center">
			{#if daoData.onChainData.currentFundingCycle}
				<a href="/admin/rounds" class="rounds-link header-link">
					<StatusCircle status="success" width="0.5rem" />
					Active Funding Round
				</a>
			{:else}
				<a href="/admin/rounds" class="rounds-link header-link">
					<StatusCircle status="alert" width="0.5rem" />
					No Active Funding Round
				</a>
			{/if}
		</div>
		<a class="pending-actions" href="/admin/actions">
			<span
				class="w-medium pending-actions-number center"
				class:done={Number(daoData.onChainData.actions.length) === 0}
			>
				{daoData.onChainData.actions.length}
			</span>
			<IconCircle icon="tabler:signature" color="primary" />
		</a>
	</div>
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

			.pending-actions-number {
				top: -4px;
				right: -4px;
				width: 12px;
				height: 12px;
				background-color: var(--clr-alert-main);
				position: absolute;
				font-size: 0.5rem;
				border-radius: 50%;

				&.done {
					background-color: var(--clr-primary-main);
				}
			}
		}
	}
</style>
