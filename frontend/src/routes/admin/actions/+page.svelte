<script type="ts">
	import { fly } from 'svelte/transition';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import PendingActionsList from '$lib/components/dao-data-blocks/pending-actions/list/PendingActionsList.svelte';
	import { getProjectInfo } from '$flow/actions';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	const userDaosStore = adminData.userDaos;

	$: activeDaoData = $userDaosStore[$activeDaoStore];

	onMount(async () => {
		activeDaoData.onChainData = await getProjectInfo(
			activeDaoData.generalInfo.contract_address,
			activeDaoData.generalInfo.owner,
			activeDaoData.generalInfo.project_id
		);
	});
</script>

<div in:fly={{ x: 10, duration: 400 }} class="column-6">
	<div>
		<h5>Actions Queue</h5>
		<p class="small">Actions waiting for signatures</p>
	</div>
	<div>
		{#if activeDaoData.onChainData.actions.length < 1}
			<span><em>This project has no actions waiting for signatures</em></span>
		{:else}
			<PendingActionsList daoData={activeDaoData} />
		{/if}
	</div>
</div>

<style lang="scss">
	h5 {
		margin-bottom: var(--space-2);
		margin-top: 0;
	}

	em {
		color: var(--clr-text-off);
	}
</style>
