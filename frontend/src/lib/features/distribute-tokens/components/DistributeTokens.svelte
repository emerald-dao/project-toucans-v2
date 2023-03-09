<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
	import DistributionStaging from './sections/DistributionStaging.svelte';
	import DistributionForms from './sections/DistributionForms.svelte';
	import { Button } from '@emerald-dao/component-library';
	import { fly } from 'svelte/transition';
	import { setContext } from 'svelte';
	import { mintTokens } from '../functions/mintTokens';
	import { withdrawTokens } from '../functions/withdrawTokens';

	export let daoData: DAOProject;
	export let distributionType: 'mint' | 'withdraw';

	setContext('daoData', daoData);

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
		if (distributionType === 'mint') {
			mintTokens(daoData, distStaging);
		} else if (distributionType === 'withdraw') {
			withdrawTokens(daoData, distStaging);
		}
	};
</script>

<div class="main-wrapper">
	<div class="forms-wrapper sub-wrapper">
		<div class="introduction">
			{#if distributionType === 'mint'}
				<h5>Mint</h5>
				<p class="small">
					{`Mint $${daoData.generalInfo.token_symbol} tokens to external wallets.`}
				</p>
			{:else}
				<h5>Withdraw</h5>
				<p class="small">Withdraw tokens from your treasury to external wallets.</p>
			{/if}
		</div>
		<DistributionForms bind:formDist bind:csvDist {addToStaging} />
	</div>
	<div class="dist-wrapper sub-wrapper card">
		<DistributionStaging bind:distStaging tokenName={daoData.generalInfo.token_symbol} />
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
