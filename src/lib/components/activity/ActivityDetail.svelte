<script type="ts">
	import { Row } from '@mateoroldos/svelte.bones';

	export let activityType: 'entry' | 'spent';
	export let details: string;
</script>

<Row gap={0.8}>
	<div class={`circle ${activityType}`} />
	<span>{details}</span>
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

	span {
		font-size: var(--fs-200);
		--font-weight: 200;
	}
</style>
