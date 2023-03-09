<script type="ts">
	import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';
	import ActivityDetail from '$components/atoms/activity/ActivityDetail.svelte';

	export let events: DaoEvent[];
</script>

<div class="column-2 align-start">
	{#each events as event, i}
		<div class="activity-wrapper">
			<ActivityDetail action={event} {i} />
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
		border-bottom: 1px solid var(--clr-neutral-badge);
	}
</style>
