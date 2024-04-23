<script lang="ts">
	import type { UserData } from './../../../_types/user-data.interface';
	import BalanceData from './blocks/BalanceData.svelte';
	import RecentTransactions from './blocks/RecentTransactions.svelte';

	export let userData: UserData;
</script>

<div class="main-wrapper">
	<BalanceData {userData} />
	<RecentTransactions {userData} />
</div>

<style lang="scss">
	.main-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
	}
</style>
