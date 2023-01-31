<script type="ts">
	import ActivityDetail from '$components/activity/ActivityDetail.svelte';
</script>

<div class="column-2 align-start">
	<div class="activity-wrapper">
		<ActivityDetail
			activityType="withdraw"
			walletAddress="0xdklnewnfeewf"
			date="14 of July"
			amount={3000}
			currency="USD"
		/>
	</div>
	<div class="activity-wrapper">
		<ActivityDetail
			activityType="purchase"
			walletAddress="0xdklnewnfeewf"
			date="14 of July"
			amount={3000}
			currency="USD"
		/>
	</div>
	<div class="activity-wrapper">
		<ActivityDetail activityType="new-cycle" walletAddress="0xdklnewnfeewf" date="14 of July" />
	</div>
	<div class="activity-wrapper">
		<ActivityDetail
			activityType="donate"
			walletAddress="0xdklnewnfeewf"
			date="14 of July"
			amount={3000}
			currency="USD"
		/>
	</div>
	<div class="activity-wrapper">
		<ActivityDetail
			activityType="withdraw"
			walletAddress="0xdklnewnfeewf"
			date="14 of July"
			amount={3000}
			currency="USD"
		/>
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
