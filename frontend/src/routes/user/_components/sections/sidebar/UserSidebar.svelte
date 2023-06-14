<script lang="ts">
	import UserVaults from './blocks/UserVaults.svelte';
	import SignerOf from './blocks/SignerOf.svelte';
	import UserBadges from './blocks/userBadges/UserBadges.svelte';
	import UserName from './blocks/UserName.svelte';
</script>

<div class="column-6">
	<UserName />
	<div class="column-6 secondary-wrapper">
		<UserBadges />
		<UserVaults />
	</div>
</div>

<style lang="scss">
	.secondary-wrapper {
		flex: 1;
	}
</style>
