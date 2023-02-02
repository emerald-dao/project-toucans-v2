<script type="ts">
	import type { Distribution } from '$lib/types/distribution.interface';
	import type { CommunityDao, FinancialDao } from '$lib/types/dao-project.interface';
	import type { Writable } from 'svelte/store';
	import DistributionStaging from './components/sections/DistributionStaging.svelte';
	import DistributionForms from './components/sections/DistributionForms.svelte';
	import { Button } from '@emerald-dao/component-library';
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: FinancialDao[] | CommunityDao[];
	} = getContext('admin-data');

	let distStaging: Distribution[] = [];

	let formDist: Distribution = {
		account: '',
		tokens: 0
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
		<div class="introduction">
			<h5>Distribute</h5>
			<p class="small">Distribute tokens within the members of it's community.</p>
		</div>
		<DistributionForms bind:formDist bind:csvDist {addToStaging} />
	</div>
	<div class="dist-wrapper sub-wrapper card">
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
		gap: var(--space-13);
		height: 100%;

		.sub-wrapper {
			.introduction {
				margin-bottom: var(--space-8);

				h5 {
					margin-bottom: var(--space-2);
					margin-top: 0;
				}
			}
		}

		.dist-wrapper {
			display: flex;
			flex-direction: column;
			gap: 1.4rem;
			transition: 3s;
			padding: var(--space-8);
		}
	}
</style>
