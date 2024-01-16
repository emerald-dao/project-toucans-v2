<script lang="ts">
	import { Currency } from '@emerald-dao/component-library';

	export let availableBalance: number | undefined | 'infinite';
	export let currency: string;
</script>

<p class="balance row-2 small">
	Your available balance:
	{#if availableBalance === 'infinite'}
		<span>∞</span>
	{:else}
		<Currency color="heading" amount={Number(availableBalance)} {currency} />
	{/if}
</p>

<style lang="scss">
	.balance {
		background-color: var(--clr-surface-primary);
		border: 1px dashed var(--clr-border-primary);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-1);
		display: flex;
		align-items: center;
	}
</style>
