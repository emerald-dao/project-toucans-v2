<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Currency } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let daoData;
	export let number: number;
</script>

<div class="card">
	<div class="logo-container">
		<div class="circle center">
			<span class="number">
				{number}
			</span>
		</div>
		<img src={daoData.logoUrl} alt={`${daoData.name} logo`} />
	</div>
	<div class="column align-start">
		<h4>{daoData.name}</h4>
		<div class="row-0">
			<span
				class="variation"
				class:positive={daoData.variationPercentage > 0}
				class:negative={daoData.variationPercentage < 0}
			>
				{#if daoData.variationPercentage > 0}
					<Icon icon="tabler:trending-up" color="#38e8c6" width="17" />
					{`${daoData.variationPercentage}`}
				{:else}
					<Icon icon="tabler:trending-down" color="##f07575" width="17" />
					{`${daoData.variationPercentage}%`}
				{/if}
			</span>
			<Currency amount={daoData.totalInvested} currency={daoData.currency} />
		</div>
		<span>{`${daoData.numberOfPayments} payments`}</span>
	</div>
</div>

<style type="scss">
	.card {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-6);

		.logo-container {
			position: relative;
		}

		.circle {
			width: 22px;
			height: 23px;
			background-color: var(--clr-surface-secondary);
			border-radius: 8px;
			position: absolute;
			margin-left: -8px;
			margin-top: -7px;
			border: 1px var(--clr-border-primary) solid;
		}

		.number {
			font-size: var(--font-size-0);
			--font-weight: 500;
		}

		img {
			width: 90px;
			height: 90px;
			border: solid 1.5px var(--clr-neutral-600);
			border-radius: 18px;
		}

		.variation {
			font-size: var(--fs-200);
			margin-right: var(--space-4);
		}

		.variation.positive {
			color: var(--clr-primary-main);
		}

		.variation.negative {
			color: var(--clr-alert-main);
		}

		h4 {
			font-size: var(--font-size-5);
			margin-bottom: var(--space-1);
		}
	}
</style>
