<script lang="ts">
	import type { UserData } from '../../../_types/user-data.interface';
	import UserVaults from './blocks/UserVaults.svelte';
	import UserName from './blocks/UserName.svelte';
	import { getContext } from 'svelte';
	import UserBadges from '../../../_features/badges/components/UserBadges.svelte';

	const userData: UserData = getContext('userData');
</script>

<div class="column-6">
	<UserName />
	<div class="column-6 secondary-wrapper">
		<UserBadges {userData} />
		<UserVaults />
	</div>
</div>

<style lang="scss">
	.secondary-wrapper {
		flex: 1;
	}
</style>
