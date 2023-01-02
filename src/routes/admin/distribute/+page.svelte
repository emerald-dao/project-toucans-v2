<script type="ts">
	import type { Distribution } from '$lib/types/distribution.interface';
	import type { FullDaoProject } from '$lib/types/dao-project.interface';
	import DistributionStaging from './components/sections/DistributionStaging.svelte';
	import DistributionForms from './components/sections/DistributionForms.svelte';
	import { Button } from '@emerald-dao/component-library';
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';

	const daoData: FullDaoProject = getContext('dao-data');

	let distStaging: Distribution[] = [];

	let formDist: Distribution = {
		account: '',
		tokens: undefined
	};
	let csvDist: Distribution[] = [];

	const addToStaging = (validForm: boolean) => {
		if (validForm) {
			distStaging = [...distStaging, { ...formDist }, ...csvDist];
		} else {
			distStaging = [...distStaging, ...csvDist];
		}
	};

	const distributeTokens = () => {
		alert('distributing');
	};
</script>

<div class="main-wrapper">
	<div class="forms-wrapper sub-wrapper">
		<DistributionForms bind:formDist bind:csvDist {addToStaging} />
	</div>
	<div class="dist-wrapper sub-wrapper">
		<DistributionStaging bind:distStaging />
		{#if distStaging.length > 0}
			<div transition:fly|local={{ y: 10, duration: 500, delay: 100 }}>
				<Button width="full-width" on:click={distributeTokens}>Distribute</Button>
			</div>
		{/if}
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: grid;
		grid-template-columns: 2fr 3fr;
		gap: 2rem;
		height: 100%;

		.sub-wrapper {
			padding: 2rem;
		}

		.dist-wrapper {
			display: flex;
			flex-direction: column;
			gap: 1.4rem;
			border: 2px var(--clr-neutral-300) solid;
			border-radius: 0.6rem;
			transition: 3s;
		}
	}
</style>
