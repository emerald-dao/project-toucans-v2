<script lang="ts">
	import Icon from '@iconify/svelte';

	export let amounts: { address: string; percent: string }[];
</script>

<div class="column-4">
	<span class="title">External Payouts</span>
	<div class="column-2">
		{#each amounts as { address, percent }}
			<div class="row-4 align-center">
				<span class="small">{address}</span>
				<Icon icon="tabler:arrow-right" color="var(--clr-primary-main)" />
				<span class="small">{Number(percent) * 100 + '%'}</span>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.title {
		color: var(--clr-heading-main);
	}
</style>
