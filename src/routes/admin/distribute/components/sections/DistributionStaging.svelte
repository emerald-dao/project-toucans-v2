<script type="ts">
	import type { Distribution } from '$lib/types/distribution.interface';
	import type { CommunityDao } from '$lib/types/dao-project.interface';
	import DistStagingElement from '../atoms/DistStagingElement.svelte';
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';

	const daoData: CommunityDao = getContext('dao-data');

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
				tokenName={daoData.token}
				on:deleteDist={() => deleteFromStaging(i)}
			/>
		{/each}
	{:else}
		<div class="request-wrapper">
			<span class="small" in:fly|local={{ y: 10, duration: 500, delay: 1000 }}>
				1. Use the input fields on the left to add wallet addresses to distribute DAO Treasury funds
				to.
			</span>
			<span class="small" in:fly|local={{ y: 10, duration: 500, delay: 1000 }}>
				2. When you are ready, click “Distribute” to send the funds.
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
			max-width: 26ch;

			&:first-child {
				margin-bottom: var(--space-4);
			}
		}
	}
</style>
