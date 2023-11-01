<script lang="ts">
	import type { UserData } from '../../../../_types/user-data.interface';
	import { getContext } from 'svelte';
	import TransactionsList from '../../../atoms/TransactionsList.svelte';

	const userData: UserData = getContext('userData');
</script>

<div class="main-wrapper">
	<TransactionsList events={userData.transactions} />
</div>

<style lang="scss">
	.main-wrapper {
		padding-inline: var(--space-4);
	}
</style>
