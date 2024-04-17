<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Currency } from '@emerald-dao/component-library';

	export let daoData: DAOProject;
</script>

<div class="main-wrapper">
	<!-- <div class="column-2">
		<Label color="tertiary" hasBorder={false}>{`$${daoData.generalInfo.token_symbol}`}</Label>
		<p>{daoData.generalInfo.description}</p>
	</div> -->
	<div class="row-5">
		{#if daoData.hasToken}
			<div class="currency-card card column-3">
				<span class="xsmall"> Total Supply </span>
				<Currency
					amount={Number(daoData.onChainData.totalSupply)}
					currency={daoData.generalInfo.token_symbol}
					color="heading"
					fontSize="var(--font-size-5)"
				/>
			</div>
		{/if}
		<div class="currency-card card column-3">
			<span class="xsmall">Total Funding</span>
			<Currency
				amount={Number(daoData.onChainData.totalFunding)}
				currency={daoData.onChainData.paymentCurrency}
				color="heading"
				fontSize="var(--font-size-5)"
			/>
		</div>
		<!-- <div class="currency-card column">
			<Currency amount={9999999} currency="FLOW" color="heading" fontSize="var(--font-size-4)" />
			<span class="xsmall">Max Supply</span>
		</div> -->
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);

		.currency-card {
			padding: var(--space-6);
			display: flex;
			flex: 1;
		}

		.xsmall {
			color: var(--clr-text-off);
		}
	}
</style>
