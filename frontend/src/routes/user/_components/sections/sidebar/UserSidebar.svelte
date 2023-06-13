<script lang="ts">
	import UserVaults from './blocks/UserVaults.svelte';
	import SignerOf from './blocks/SignerOf.svelte';
	import UserBadges from './blocks/userBadges/UserBadges.svelte';
	import UserName from './blocks/UserName.svelte';
</script>

<div class="column-8 section">
	<UserName />
	<div class="column-8">
		<SignerOf />
		<UserBadges />
		<UserVaults />
	</div>
</div>
