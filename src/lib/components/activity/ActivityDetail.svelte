<script type="ts">
	import { StatusCircle } from '@emerald-dao/component-library';
	import { Column, Row } from '@mateoroldos/svelte.bones';

	export let activityType: 'alert' | 'success';
	export let walletAddress: string;
	export let date: string;
</script>

<Row gap={0.8}>
	<StatusCircle status={activityType} />
	<Column align="flex-start" gap={0.1}>
		<p class="address">{walletAddress}</p>
		<span class="date">{date}</span>
	</Column>
</Row>

<style type="scss">
	.circle {
		width: 10px;
		height: 10px;
		border-radius: 100%;
	}

	.circle.entry {
		background-color: var(--clr-success-main);
	}

	.circle.spent {
		background-color: var(--clr-alert-main);
	}

	.address {
		color: var(--clr-heading-main);
		font-size: var(--font-size-1);
	}

	.date {
		font-size: var(--font-size-0);
	}
</style>
