<script type="ts">
	import { Card } from '$atoms';
	import { Row, Column } from '@mateoroldos/svelte.bones';
	import type { LeadingDao } from '$lib/types/leading-dao.interface';

	export let daoData: LeadingDao;
	export let number: number;
</script>

<Card padding={3}>
	<Row gap="small">
		<span class="number">
			{number}
		</span>
		<img src={daoData.logoUrl} alt={`${daoData.name} logo`} />
		<Column gap="none" align="flex-start">
			<h4>{daoData.name}</h4>
			<Row gap="small">
				<span>{`${daoData.totalInvested} ${daoData.currency}`}</span>
				<span
					class="variation"
					class:positive={daoData.variationPercentage > 0}
					class:negative={daoData.variationPercentage < 0}
				>
					{`${daoData.variationPercentage > 0 ? '+' : ''}${daoData.variationPercentage}%`}
				</span>
			</Row>
			<span>{`${daoData.numberOfPayments} payments`}</span>
		</Column>
	</Row>
</Card>

<style type="scss">
	.number {
		font-size: var(--fs-500);
		--font-weight: 600;
	}

	.variation {
		font-size: var(--fs-200);
	}

	.variation.positive {
		color: var(--clr-success-main);
	}

	.variation.negative {
		color: var(--clr-alert-main);
	}
</style>
