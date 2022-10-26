<script type="ts">
	import type { Distribution } from '$lib/types/distribution.interface';
	import type { FullDaoProject } from '$lib/types/dao-project.interface';
	import DistStagingElement from '../atoms/DistStagingElement.svelte';
	import { getContext } from 'svelte';

	const daoData: FullDaoProject = getContext('dao-data');

	const deleteFromStaging = (i: number) => {
		distStaging.splice(i, 1);
		distStaging = distStaging;
	};

	export let distStaging: Distribution[];
</script>

<div class="dist-elements-wrapper">
	{#each distStaging as dist, i}
		<DistStagingElement
			forAccount={dist.account}
			amount={dist.tokens}
			tokenName={daoData.tokenName}
			on:deleteDist={() => deleteFromStaging(i)}
		/>
	{/each}
</div>

<style type="scss">
	.dist-elements-wrapper {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow-y: auto;
		overflow-x: hidden;
	}
</style>
