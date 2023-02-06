<script type="ts">
	import ActivityDetail from '$components/activity/ActivityDetail.svelte';

	export let actions;
</script>

<div class="column-2 align-start">
	{#each actions as action}
		<div class="activity-wrapper">
			<ActivityDetail
				activityType={action.type}
				walletAddress={action.by}
				date={action.timestamp}
				amount={action.amount}
				currency="$FLOW"
			/>
		</div>
	{/each}
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
