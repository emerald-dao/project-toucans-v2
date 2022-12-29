<script type="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	function deleteDist() {
		dispatch('deleteDist');
	}

	export let forAccount: string;
	export let amount: number | undefined;
	export let tokenName: string;
</script>

<div transition:fly|local={{ x: 10, duration: 700 }}>
	<div class="row-1">
		<div class="card-primary">
			<div class="row-4" gap={1}>
				<span><span class="token-name">{`$${tokenName} `} </span>{amount}</span>
				<Icon icon="tabler:arrow-narrow-right" />
				<span>{forAccount}</span>
			</div>
		</div>
		<div class="clickable" on:click={deleteDist} on:keydown>
			<Icon icon="tabler:circle-x" />
		</div>
	</div>
</div>

<style type="scss">
	span {
		font-size: var(--fs-100);
		--font-weight: 500;
	}

	.token-name {
		color: var(--clr-font-text-t5);
	}

	.clickable {
		cursor: pointer;
	}
</style>
