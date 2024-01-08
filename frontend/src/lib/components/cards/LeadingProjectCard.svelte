<script type="ts">
	import type { DaoRankingData } from '$lib/features/dao-ranking/types/dao-ranking-data.interface';
	import { handleLogoImgError } from '$lib/utilities/handleLogoImgError';
	import { Currency, Label } from '@emerald-dao/component-library';

	export let daoData: DaoRankingData;
	export let number: number;
</script>

<a class="card" id="no-style" href={`/p/${daoData.project_id}`}>
	<div class="logo-container">
		<div class="circle center">
			<span class="number">
				{number}
			</span>
		</div>
		<img
			src={daoData.projects.logo || '/toucans-logo.png'}
			on:error={(e) => handleLogoImgError(e)}
			alt={`${daoData.projects.name} logo`}
		/>
	</div>
	<div class="column align-start">
		<h4>{daoData.projects.name}</h4>
		{#if daoData.treasury_value}
			<div class="row-2">
				Treasury Value:
				<Currency amount={daoData.treasury_value} moneyPrefix color="heading" decimalNumbers={2} />
			</div>
		{/if}
		{#if daoData.price && daoData.price >= 0.01}
			<div class="row-0">
				<Label size="small" color="tertiary" hasBorder={false}>
					{`$${daoData.projects.token_symbol}`}
				</Label>
				<Currency amount={daoData.price} moneyPrefix color="heading" decimalNumbers={2} />
			</div>
		{/if}
	</div>
</a>

<style type="scss">
	#no-style {
		text-decoration: none;
		color: unset;
	}
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
			min-width: 90px;
			min-height: 90px;
			max-width: 90px;
			max-height: 90px;
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
