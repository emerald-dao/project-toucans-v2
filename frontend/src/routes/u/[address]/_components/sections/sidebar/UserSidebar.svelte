<script lang="ts">
	import type { UserData } from '../../../_types/user-data.interface';
	import UserVaults from './blocks/UserVaults.svelte';
	import { getContext } from 'svelte';
	import UserBadges from '../../../_features/badges/components/UserBadges.svelte';
	import UserAvatar from '$components/atoms/user/UserAvatar.svelte';

	const userData: UserData = getContext('userData');
</script>

<div class="column-6">
	<UserAvatar
		userProfile={userData.profile}
		imageSize="130px"
		fontSize="var(--font-size-6)"
		walletFontSize="var(--font-size-2)"
		userLink={false}
	/>
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
