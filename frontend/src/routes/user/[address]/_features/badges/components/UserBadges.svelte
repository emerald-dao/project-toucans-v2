<script lang="ts">
	import DashboardHeading from '../../../_components/atoms/DashboardHeading.svelte';
	import type { UserData } from '../../../_types/user-data.interface';
	import getUserBadges from '../functions/getUserBadges';
	import USER_BADGES from '../userBadges';
	import UserBadge from './atoms/UserBadge.svelte';

	export let userData: UserData;

	const userLevels = getUserBadges(userData);
</script>

<div class="column-2">
	<DashboardHeading icon="tabler:medal">Badges</DashboardHeading>
	<div class="badges-wrapper">
		{#each userLevels as level, i}
			{#if level === 0}
				<UserBadge badgeLevel={USER_BADGES[i].levels[0]} noLevel={true} levelNumber={level} />
			{:else}
				<UserBadge
					badgeLevel={USER_BADGES[i].levels[level - 1]}
					levelNumber={level}
					nextLevelGoal={USER_BADGES[i].levels[level]
						? USER_BADGES[i].levels[level].goal
						: undefined}
				/>
			{/if}
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
