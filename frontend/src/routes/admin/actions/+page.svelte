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
			{#each activeDaoData.onChainData.actions as action}
				<ActionElement
					projectOwner={activeDaoData.generalInfo.owner}
					projectId={activeDaoData.generalInfo.project_id}
					{action}
					threshold={activeDaoData.onChainData.threshold}
				/>
			{/each}
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
