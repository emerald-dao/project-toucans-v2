<script type="ts">
	import ActivityDetail from '$components/activity/ActivityDetail.svelte';
	import { Currency } from '@emerald-dao/component-library';
	import { Column, Row } from '@mateoroldos/svelte.bones';
</script>

<Column gap={0.4} align="flex-start">
	<div class="activity-wrapper">
		<ActivityDetail activityType="success" walletAddress="0xdklnewnfeewf" date="14 of July" />
		<Currency amount={3000} currency="USD" color="heading" fontSize="0.75rem" />
	</div>
	<div class="activity-wrapper">
		<ActivityDetail activityType="alert" walletAddress="0xdklnewnfeewf" date="14 of July" />
		<Currency amount={-20000} currency="USD" color="heading" fontSize="0.75rem" />
	</div>
	<div class="activity-wrapper">
		<ActivityDetail activityType="success" walletAddress="0xdklnewnfeewf" date="14 of July" />
		<Currency amount={600000} currency="USD" color="heading" fontSize="0.75rem" />
	</div>
	<div class="activity-wrapper">
		<ActivityDetail activityType="alert" walletAddress="0xdklnewnfeewf" date="14 of July" />
		<Currency amount={-500} currency="USD" color="heading" fontSize="0.75rem" />
	</div>
	<div class="activity-wrapper">
		<ActivityDetail activityType="alert" walletAddress="0xdklnewnfeewf" date="14 of July" />
		<Currency amount={-500} currency="USD" color="heading" fontSize="0.75rem" />
	</div>
</Column>

<style type="scss">
	.activity-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--space-2);
		border-bottom: 1px solid var(--clr-border-primary);
	}
</style>
