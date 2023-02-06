<script type="ts">
	import type { CommunityDao } from '$lib/types/dao-project.interface';
	import { Currency } from '@emerald-dao/component-library';

	export let daoData: CommunityDao;
</script>

<div class="column-2 align-start">
	{#each Object.entries(daoData.balances) as balance}
		<div class="activity-wrapper">
			<div class="row-3 align-center">
				<img src="/avatar-header.png" alt="avatar logo" />
				<span class="holder-name">{balance[0]}</span>
			</div>
			<Currency
				amount={Number(balance[1])}
				currency={daoData.token_symbol}
				color="heading"
				fontSize="0.85rem"
			/>
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
	.holder-name {
		color: var(--clr-heading-main);
		font-size: var(--font-size-1);
	}
</style>
