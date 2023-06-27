<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { user } from '$stores/flow/FlowStore';
	import UserBalance from '../atoms/UserBalance.svelte';
	import ProjectSupply from '../atoms/ProjectSupply.svelte';
	import ProjectFunding from '../atoms/ProjectFunding.svelte';

	export let daoData: DAOProject;

	daoData.onChainData.maxSupply = '9000';
</script>

<div class="main-wrapper">
	{#if $user.addr}
		<UserBalance {daoData} />
	{/if}
	<div class="secondary-wrapper">
		<ProjectFunding {daoData} />
		<ProjectSupply {daoData} />
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);

		.secondary-wrapper {
			display: flex;
			flex-direction: row;
			gap: var(--space-7);
		}
	}
</style>
