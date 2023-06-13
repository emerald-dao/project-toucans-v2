<script>
	import BalanceData from './blocks/BalanceData.svelte';
	import RecentTransactions from './blocks/RecentTransactions.svelte';
</script>

<div class="section">
	<BalanceData />
	<RecentTransactions />
</div>

<style lang="scss">
	.section {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
	}
</style>
