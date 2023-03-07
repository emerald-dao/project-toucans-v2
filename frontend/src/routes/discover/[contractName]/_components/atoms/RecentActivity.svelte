<script type="ts">
	import ActivityDetail from '$components/atoms/activity/ActivityDetail.svelte';
	import type { Action } from '$lib/types/dao-project/dao-event/dao-event.type';

	export let actions: Action[];
</script>

<div class="column-2 align-start">
	{#each actions as action, i}
		<div class="activity-wrapper">
			<ActivityDetail
				{action}
				{i}
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
