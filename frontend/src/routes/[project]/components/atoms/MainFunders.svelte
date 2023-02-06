<script type="ts">
	import { Currencies } from '$lib/types/currencies.enum';
	import type { FinancialDao } from '$lib/types/dao-project.interface';
	import { Currency } from '@emerald-dao/component-library';
	export let daoData: FinancialDao;
</script>

<div class="column-2 align-start">
	{#each Object.entries(daoData.funders) as [funder, amount]}
		<div class="activity-wrapper">
			<div class="row-3 align-center">
				<img src="/avatar-header.png" alt="avatar logo" />
				<span class="funder-name">{funder}</span>
			</div>
			<Currency {amount} currency={Currencies.FLOW} color="heading" fontSize="0.85rem" />
		</div>
	{/each}
</div>

<style type="scss">
	.activity-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--space-2);
		border-bottom: 1px solid var(--clr-border-primary);
	}
	.funder-name {
		color: var(--clr-heading-main);
		font-size: var(--font-size-1);
	}
</style>
