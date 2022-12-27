<script type="ts">
	import { Row, Column } from '@mateoroldos/svelte.bones';
	import type { LeadingDao } from '$lib/types/leading-dao.interface';
	import Icon from '@iconify/svelte';

	export let daoData: LeadingDao;
	export let number: number;
</script>

<div class="card-primary">
	<Row gap="small">
		<div class="logo-container">
			<div class="circle center">
				<span class="number">
					{number}
				</span>
			</div>
			<img src={daoData.logoUrl} alt={`${daoData.name} logo`} />
		</div>
		<Column gap="none" align="flex-start">
			<h4>{daoData.name}</h4>
			<Row gap="none">
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
				<span>{`${daoData.totalInvested} $${daoData.currency}`}</span>
			</Row>
			<span>{`${daoData.numberOfPayments} payments`}</span>
		</Column>
	</Row>
</div>

<style type="scss">
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
	}

	.number {
		font-size: var(--fs-500);
		--font-weight: 600;
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
</style>
