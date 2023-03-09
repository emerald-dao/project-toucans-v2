<script type="ts">
	import { fly } from 'svelte/transition';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import ActionElement from '$lib/features/action-queue/components/atoms/ActionElement.svelte';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: DAOProject[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;

	$: activeDaoData = adminData.userDaos[$activeDaoStore];

	console.log(adminData.userDaos[$activeDaoStore]);
</script>

<div in:fly={{ x: 10, duration: 400 }} class="column-4">
	<div>
		<h5>Actions Queue</h5>
		<p class="small">Actions waiting for signatures</p>
	</div>
	<div>
		<ActionElement actionType="Withdraw" actionId="0x3213" signed={true} />
		<ActionElement actionType="NewFundingCycle" actionId="0x3213" signed={false} />
		<ActionElement actionType="RemoveSigner" actionId="0x3213" signed={true} />
	</div>
</div>

<style lang="scss">
	h5 {
		margin-bottom: var(--space-2);
		margin-top: 0;
	}
</style>
