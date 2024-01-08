<script type="ts">
	import { Currency } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import UserAvatar from '$components/atoms/user/UserAvatar.svelte';

	const dispatch = createEventDispatcher();

	function deleteDist() {
		dispatch('deleteDist');
	}

	export let forAccount: string;
	export let amount: number;
	export let tokenName: string;
</script>

<div transition:fly|local={{ x: 10, duration: 700 }}>
	<div class="main-wrapper row-4 align-center">
		<div class="card-primary row-space-between align-center">
			<Currency {amount} currency={tokenName} />
			<Icon icon="tabler:arrow-narrow-right" />
			<UserAvatar address={forAccount} />
		</div>
		<div class="clickable" on:click={deleteDist} on:keydown>
			<Icon class="header-link" icon="tabler:x" />
		</div>
	</div>
</div>

<style type="scss">
	.main-wrapper {
		width: 100%;

		.card-primary {
			width: 100%;
			padding: var(--space-4) var(--space-6);
			border-radius: var(--radius-1);
		}

		.clickable {
			cursor: pointer;
		}
	}
</style>
