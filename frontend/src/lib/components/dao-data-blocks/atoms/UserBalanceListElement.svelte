<script lang="ts">
	import { Currency } from '@emerald-dao/component-library';

	export let address: string;
	export let balance: string;
	export let tokenSymbol: string;
</script>

<div class="activity-wrapper">
	<div class="row-2 align-center">
		<img src="/new-avatar.png" alt="avatar logo" />
		<span class="holder-name">{address}</span>
	</div>
	<Currency
		amount={Number(balance)}
		currency={tokenSymbol}
		color="heading"
		fontSize="var(--font-size-0)"
	/>
</div>

<style type="scss">
	.activity-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--space-2);
		border-bottom: 1px solid var(--clr-neutral-badge);

		img {
			width: 1.8rem;
			height: 1.8rem;
			border-radius: 50%;
		}

		.holder-name {
			color: var(--clr-heading-main);
			font-size: var(--font-size-0);
		}
	}
</style>
