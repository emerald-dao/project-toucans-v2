<script lang="ts">
	import DashboardHeading from '../../../../atoms/DashboardHeading.svelte';
	import UserBadge from './atoms/UserBadge.svelte';
</script>

<div class="column-2">
	<DashboardHeading icon="tabler:medal">Badges</DashboardHeading>
	<div class="badges-wrapper">
		<UserBadge />
		<UserBadge />
		<UserBadge />
		<UserBadge />
		<UserBadge />
	</div>
</div>

<style lang="scss">
	.badges-wrapper {
		display: flex;
		flex-direction: row;
		gap: var(--space-3);
		flex-wrap: wrap;
	}
</style>
