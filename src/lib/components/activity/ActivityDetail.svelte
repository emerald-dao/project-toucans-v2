<script type="ts">
	import { StatusCircle } from '@emerald-dao/component-library';

	export let activityType: 'alert' | 'success';
	export let walletAddress: string;
	export let date: string;
</script>

<div class="row-3 align-center">
	<StatusCircle status={activityType} width="8px" />
	<div class="column">
		<p class="address">{walletAddress}</p>
		<span class="date">{date}</span>
	</div>
</div>

<style type="scss">
	.address {
		color: var(--clr-heading-main);
		font-size: var(--font-size-1);
	}

	.date {
		font-size: var(--font-size-0);
		line-height: normal;
		margin-bottom: var(--space-1);
	}
</style>
