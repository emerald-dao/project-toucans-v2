<script lang="ts">
	import { Currency } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let amounts: {
		[account: string]: string;
	};
	export let currency: string;
</script>

<div class="column-4">
	<span class="title">Distribution</span>
	<div class="column-2">
		{#each Object.entries(amounts) as [address, value]}
			<div class="row-4 align-center">
				<span class="small">{address}</span>
				<Icon icon="tabler:arrow-right" color="var(--clr-primary-main)" />
				<Currency amount={Number(value)} {currency} color="heading" />
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.title {
		color: var(--clr-heading-main);
	}
</style>
