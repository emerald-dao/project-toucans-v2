<script type="ts">
	import type { Distribution } from '$lib/types/distribution.interface';
	import type { FullDaoProject } from '$lib/types/dao-project.interface';
	import DistStagingElement from '../atoms/DistStagingElement.svelte';
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';

	const daoData: FullDaoProject = getContext('dao-data');

	const deleteFromStaging = (i: number) => {
		distStaging.splice(i, 1);
		distStaging = distStaging;
	};

	export let distStaging: Distribution[];
</script>

<div class="dist-elements-wrapper">
	{#if distStaging.length > 0}
		{#each distStaging as dist, i}
			<DistStagingElement
				forAccount={dist.account}
				amount={dist.tokens}
				tokenName={daoData.tokenName}
				on:deleteDist={() => deleteFromStaging(i)}
			/>
		{/each}
	{:else}
		<div class="request-wrapper">
			<span in:fly|local={{ y: 10, duration: 500, delay: 1000 }}>
				Add elements to the staging area to make a distribution
			</span>
		</div>
	{/if}
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

	.request-wrapper {
		height: 100%;
		width: 100%;
		display: grid;
		place-content: center;

		span {
			text-align: center;
			max-width: 20ch;
			color: var(--clr-font-text-soft);
			font-size: var(--fs-300);
		}
	}
</style>
