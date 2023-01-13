<script type="ts">
	import type { FinancialDao } from '$lib/types/dao-project.interface';
	import { Currency } from '@emerald-dao/component-library';
	export let daoData: FinancialDao;
</script>

<div class="column-2 align-start">
	{#each daoData.mainFunders as funder}
		<div class="activity-wrapper">
			<div class="row-3 align-center">
				<img src="/avatar-header.png" alt="avatar logo" />
				<span class="funder-name">{funder[0]}</span>
			</div>
			<Currency amount={funder[1]} currency={daoData.token} color="heading" fontSize="0.85rem" />
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
