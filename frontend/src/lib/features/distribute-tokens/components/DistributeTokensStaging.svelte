<script type="ts">
	import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
	import { Currency } from '@emerald-dao/component-library';
	import DistStagingElement from './atoms/DistStagingElement.svelte';
	import { fly, fade } from 'svelte/transition';

	const deleteFromStaging = (i: number) => {
		distStaging.splice(i, 1);
		distStaging = distStaging;
	};

	export let distStaging: Distribution[];
	export let tokenName: string;
</script>

<div class="dist-elements-wrapper card" in:fade|local={{ duration: 200 }}>
	{#if distStaging.length > 0}
		<p class="row-1 small">
			Amount of tokens to distribute:
			<Currency
				color="heading"
				amount={distStaging.reduce((acc, curr) => acc + Number(curr.amount), 0)}
				currency={tokenName}
			/>
		</p>
		{#each distStaging as dist, i (dist)}
			<DistStagingElement
				forAccount={dist.address}
				amount={Number(dist.amount)}
				{tokenName}
				on:deleteDist={() => deleteFromStaging(i)}
			/>
		{/each}
	{:else}
		<div class="request-wrapper">
			<span class="small" in:fly|local={{ y: 10, duration: 500, delay: 400 }}>
				<em> Please add users and tokens to distribute.</em>
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
			color: var(--clr-text-off);
			text-align: center;

			&:first-child {
				margin-bottom: var(--space-4);
			}
		}
	}
</style>
