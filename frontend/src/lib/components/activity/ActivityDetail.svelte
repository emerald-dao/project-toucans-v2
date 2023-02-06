<script type="ts">
	import { formatDate } from '$lib/utilities/formatDate';
	import { Label, StatusCircle, Currency } from '@emerald-dao/component-library';

	export let activityType: 'Purchase' | 'Withdraw' | 'NewFundingCycle' | 'Donate';
	export let walletAddress: string;
	export let date: string;
	export let amount: number | undefined = undefined;
	export let currency: string | undefined = undefined;
</script>

<div class="main-wrapper">
	<div class="row-3 align-center">
		{#if activityType === 'Purchase' || activityType === 'Donate'}
			<StatusCircle status="success" width="8px" />
		{:else if activityType === 'Withdraw'}
			<StatusCircle status="alert" width="8px" />
		{:else if activityType === 'NewFundingCycle'}
			<StatusCircle status="active" width="8px" />
		{/if}
		<div class="column info-wrapper">
			<p class="address">{walletAddress}</p>
			<span class="date">{formatDate(new Date(date * 1000))}</span>
		</div>
		{#if activityType === 'Purchase' || activityType === 'Donate'}
			<Label size="xx-small" color="primary" hasBorder={false}>
				{activityType}
			</Label>
		{:else if activityType === 'Withdraw'}
			<Label size="xx-small" color="alert" hasBorder={false}>
				{activityType}
			</Label>
		{:else if activityType === 'NewFundingCycle'}
			<Label size="xx-small" color="tertiary" hasBorder={false}>
				{activityType}
			</Label>
		{/if}
	</div>
	{#if currency && amount}
		<Currency
			amount={activityType === 'Withdraw' ? -amount : amount}
			{currency}
			color="heading"
			fontSize="0.85rem"
		/>
	{/if}
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
</style>
