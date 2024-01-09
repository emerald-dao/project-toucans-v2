<script lang="ts">
	import { user } from '$stores/flow/FlowStore';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import PendingActionsListElement from './PendingActionsListElement.svelte';

	export let daoData: DAOProject;
	export let showDetail = true;
</script>

{#each daoData.onChainData.actions as action (action)}
	<PendingActionsListElement
		projectOwner={daoData.generalInfo.owner}
		daoId={daoData.generalInfo.project_id}
		{action}
		threshold={action.threshold}
		{showDetail}
		isSigner={$user.addr ? action.signers.includes($user.addr) : false}
		showDao={false}
	/>
{/each}
