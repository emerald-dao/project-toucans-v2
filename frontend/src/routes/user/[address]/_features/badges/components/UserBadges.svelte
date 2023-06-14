<script lang="ts">
	import DashboardHeading from '../../../_components/atoms/DashboardHeading.svelte';
	import type { UserData } from '../../../_types/user-data.interface';
	import getUserBadges from '../functions/getUserBadges';
	import UserBadge from './atoms/UserBadge.svelte';

	export let userData: UserData;

	const userBadges = getUserBadges(userData);
</script>

<div class="column-2">
	<DashboardHeading icon="tabler:medal">Badges</DashboardHeading>
	<div class="badges-wrapper">
		{#each userBadges as badgeLevel}
			<UserBadge {badgeLevel} />
		{/each}
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
