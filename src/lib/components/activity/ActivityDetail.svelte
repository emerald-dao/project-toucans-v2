<script type="ts">
	import { Label, StatusCircle, Currency } from '@emerald-dao/component-library';

	export let activityType: 'purchase' | 'withdraw' | 'new-cycle' | 'donate';
	export let walletAddress: string;
	export let date: string;
	export let amount: number | undefined = undefined;
	export let currency: string | undefined = undefined;
</script>

<div class="main-wrapper">
	<div class="row-3 align-center">
		{#if activityType === 'purchase' || activityType === 'donate'}
			<StatusCircle status="success" width="8px" />
		{:else if activityType === 'withdraw'}
			<StatusCircle status="alert" width="8px" />
		{:else if activityType === 'new-cycle'}
			<StatusCircle status="active" width="8px" />
		{/if}
		<div class="column info-wrapper">
			<p class="address">{walletAddress}</p>
			<span class="date">{date}</span>
		</div>
		{#if activityType === 'purchase' || activityType === 'donate'}
			<Label size="xx-small" color="primary" hasBorder={false}>
				{activityType}
			</Label>
		{:else if activityType === 'withdraw'}
			<Label size="xx-small" color="alert" hasBorder={false}>
				{activityType}
			</Label>
		{:else if activityType === 'new-cycle'}
			<Label size="xx-small" color="tertiary" hasBorder={false}>
				{activityType}
			</Label>
		{/if}
	</div>
	{#if currency && amount}
		<Currency
			amount={activityType === 'withdraw' ? -amount : amount}
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
