<script type="ts">
	import ActivityDetail from '$components/activity/ActivityDetail.svelte';
	import { Currency } from '@emerald-dao/component-library';
</script>

<div class="column-2 align-start">
	<div class="activity-wrapper">
		<ActivityDetail activityType="success" walletAddress="0xdklnewnfeewf" date="14 of July" />
		<Currency amount={3000} currency="USD" color="heading" fontSize="0.85rem" />
	</div>
	<div class="activity-wrapper">
		<ActivityDetail activityType="alert" walletAddress="0xdklnewnfeewf" date="14 of July" />
		<Currency amount={-20000} currency="USD" color="heading" fontSize="0.85rem" />
	</div>
	<div class="activity-wrapper">
		<ActivityDetail activityType="success" walletAddress="0xdklnewnfeewf" date="14 of July" />
		<Currency amount={600000} currency="USD" color="heading" fontSize="0.85rem" />
	</div>
	<div class="activity-wrapper">
		<ActivityDetail activityType="alert" walletAddress="0xdklnewnfeewf" date="14 of July" />
		<Currency amount={-500} currency="USD" color="heading" fontSize="0.85rem" />
	</div>
	<div class="activity-wrapper">
		<ActivityDetail activityType="alert" walletAddress="0xdklnewnfeewf" date="14 of July" />
		<Currency amount={-500} currency="USD" color="heading" fontSize="0.85rem" />
	</div>
</div>

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
