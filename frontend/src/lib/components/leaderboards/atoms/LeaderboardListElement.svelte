<script lang="ts">
	import UserAvatar from '$components/atoms/UserAvatar.svelte';
	import type { Profile } from '$lib/types/common/profile.interface';

	export let rank: number;
	export let profile: Profile;
</script>

<div class="main-wrapper row-5 row-space-between align-center">
	<div class="row-3 align-center">
		<span class="rank small w-medium">{rank}</span>
		<UserAvatar {profile} />
	</div>
	<slot />
</div>

<style lang="scss">
	.main-wrapper {
		padding-block: var(--space-3);
		border-bottom: 0.5px solid var(--clr-neutral-badge);
	}
</style>
