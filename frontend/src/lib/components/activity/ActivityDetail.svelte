<script type="ts">
	import Icon from '@iconify/svelte';
	import FundingStats from '$lib/components/atoms/FundingStats.svelte';
	import { formatDate } from '$lib/utilities/formatDate';
	import { Label, StatusCircle, Currency, Modal, getModal } from '@emerald-dao/component-library';
	import type { Action } from '$lib/types/actions/actions.type';
	import { getFundingCycleData } from '$lib/utilities/projects/getFundingCycleData';
	import type { Dao } from '$lib/types/dao-project.interface';
	import { getContext } from 'svelte';

	export let action: Action;
	export let i: number;

	let daoData: Dao = getContext('daoData');
</script>

<div class="main-wrapper">
	<div class="row-3 align-center">
		{#if action.type === 'Purchase' || action.type === 'Donate'}
			<StatusCircle status="success" width="8px" />
		{:else if action.type === 'Withdraw'}
			<StatusCircle status="alert" width="8px" />
		{:else if action.type === 'NewFundingCycle'}
			<StatusCircle status="active" width="8px" />
		{/if}
		<div class="column info-wrapper">
			<p class="address">{action.by}</p>
			<span class="date">{formatDate(new Date(action.timestamp * 1000))}</span>
		</div>
		{#if action.type === 'Purchase' || action.type === 'Donate'}
			<Label size="xx-small" color="primary" hasBorder={false}>
				{action.type}
			</Label>
		{:else if action.type === 'Withdraw'}
			<Label size="xx-small" color="alert" hasBorder={false}>
				{action.type}
			</Label>
		{:else if action.type === 'NewFundingCycle'}
			<Label size="xx-small" color="tertiary" hasBorder={false}>
				{action.type}
			</Label>
		{/if}
	</div>
	<div class="row-3">
		{#if action.type === 'Purchase' && action.message}
			<div class="header-link" on:click={() => getModal(`message-${i}`).open()} on:keydown>
				<Icon icon="tabler:message" />
			</div>
			<Modal background="var(--clr-background-secondary)" id={`message-${i}`}>
				<span class="special-message-heading">Special Message</span>
				<p class="special-message">{action.message}</p>
			</Modal>
		{/if}

		{#if action.type === 'Purchase' || action.type === 'Donate' || action.type === 'Withdraw'}
			<Currency
				amount={action.type === 'Withdraw' ? -Number(action.amount) : Number(action.amount)}
				currency="FLOW"
				color="heading"
				fontSize="0.85rem"
			/>
		{:else if action.type === 'NewFundingCycle'}
			<div class="header-link" on:click={() => getModal(`funding-stats-activity-${i}`).open()} on:keydown>
				<Icon icon="tabler:eye" />
			</div>
			<Modal background="var(--clr-background-secondary)" id={`funding-stats-activity-${i}`}>
				<FundingStats fundingCycleData={getFundingCycleData(daoData, action.cycleNum)} hasBorder={false} title="Funding round data" />
			</Modal>
		{/if}
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;

		.info-wrapper {
			margin-right: var(--space-3);

			.address {
				color: var(--clr-heading-main);
				font-size: var(--font-size-1);
			}

			.date {
				font-size: var(--font-size-0);
				line-height: normal;
				margin-bottom: var(--space-1);
			}
		}
	}

	.special-message-heading {
		color: var(--clr-heading-main);
	}

	.special-message {
		max-width: 40ch;
		margin-top: var(--space-2);
	}
</style>
