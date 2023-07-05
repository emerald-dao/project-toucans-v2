<script lang="ts">
	import { fly } from 'svelte/transition';
	import UserAvatar from '$components/atoms/user/UserAvatar.svelte';

	export let rank: number;
	export let address: string;
	export let pageMove: 'next' | 'previous' = 'next';
	export let pagePosition: number = 0;
</script>

<div
	class="main-wrapper row-5 row-space-between align-center"
	in:fly|local={{ x: pageMove === 'next' ? 10 : -10, duration: 800, delay: 80 * pagePosition }}
>
	<div class="row-3 align-center">
		<span class="rank small w-medium">{rank}</span>
		<UserAvatar {address} />
	</div>
	<slot />
</div>

<style lang="scss">
	.main-wrapper {
		padding-block: var(--space-3);
		border-bottom: 0.5px solid var(--clr-neutral-badge);
	}
</style>
