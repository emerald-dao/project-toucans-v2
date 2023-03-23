<script type="ts">
	import { PendingActionsList } from '$components/dao-data-blocks';
	import { fly } from 'svelte/transition';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	const userDaosStore = adminData.userDaos;

	$: activeDaoData = $userDaosStore[$activeDaoStore];
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
