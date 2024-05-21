<script lang="ts">
	import { isStaged, stageContractExecution } from "$flow/actions";
	import type { DAOProject } from "$lib/types/dao-project/dao-project.interface";

    export let daoData: DAOProject;
    let staged = fetchStaged();

    async function fetchStaged() {
        return await isStaged(daoData.generalInfo.contract_address as string, daoData.generalInfo.project_id)
    }

    async function stage() {
        await stageContractExecution(daoData);
        staged = fetchStaged();
    }
</script>

{#await staged then isContractStaged}
    {#if isContractStaged}
        <p>You have correctly staged!</p>
    {:else}
        <button on:click={stage}>Stage Contract</button>
    {/if}
{/await}