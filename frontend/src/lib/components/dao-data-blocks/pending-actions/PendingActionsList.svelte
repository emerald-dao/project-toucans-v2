<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import PendingActionsListElement from './PendingActionsListElement.svelte';

	export let daoData: DAOProject;
	export let showDetail = true;
</script>

{#each daoData.onChainData.actions as action}
	<PendingActionsListElement
		projectOwner={daoData.generalInfo.owner}
		projectId={daoData.generalInfo.project_id}
		{action}
		threshold={daoData.onChainData.threshold}
		{showDetail}
	/>
{/each}
