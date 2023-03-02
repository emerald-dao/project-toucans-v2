<script type="ts">
	import { fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	export let address: string;
	export let percentage: number;
	export let i: number;
	export let canDelete = true;

	const dispatch = createEventDispatcher();

	const randomColor = '#' + (((1 << 24) * Math.random()) | 0).toString(16);
	document.documentElement.style.setProperty(`--random-color-${i}`, randomColor);
</script>

<div class="row-2 align-center" transition:fly|local={{ x: 10, duration: 200 }}>
	<div class="circle" style={`background-color: var(--random-color-${i});`} />
	<span class="xsmall">{address}</span><span class="xsmall percentage">{`${percentage}%`}</span>
	{#if canDelete}
		<div class="icon-wrapper" on:click={() => dispatch('delete')} on:keypress>
			<Icon icon="tabler:x" width="10px" />
		</div>
	{/if}
</div>

<style type="scss">
	.circle {
		width: 7px;
		height: 7px;
		border-radius: 50%;
	}

	.icon-wrapper {
		cursor: pointer;
	}

	.percentage {
		color: var(--clr-primary-main);
	}
</style>
