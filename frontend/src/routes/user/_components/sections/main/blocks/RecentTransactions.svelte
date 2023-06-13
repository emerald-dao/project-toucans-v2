<script lang="ts">
	import DashboardHeading from '../../../atoms/DashboardHeading.svelte';
	import type { UserData } from '../../../../_types/user-data.interface';
	import { getContext } from 'svelte';
	import TransactionsList from '../../../atoms/TransactionsList.svelte';

	const userData: UserData = getContext('userData');
</script>

<TransactionsList events={userData.transactions} />
