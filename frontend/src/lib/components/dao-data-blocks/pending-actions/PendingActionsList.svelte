<script lang="ts">
	import { user } from '$stores/flow/FlowStore';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import PendingActionsListElement from './PendingActionsListElement.svelte';

	export let daoData: DAOProject;
	export let showDetail = true;
</script>

{#if $user.addr}
	{#each daoData.onChainData.actions as action}
		<PendingActionsListElement
			projectOwner={daoData.generalInfo.owner}
			daoId={daoData.generalInfo.project_id}
			{action}
			threshold={daoData.onChainData.threshold}
			{showDetail}
			isSigner={daoData.onChainData.signers.includes($user.addr)}
			showDao={false}
		/>
	{/each}
{/if}
