<script type="ts">
	import { onMount } from 'svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import * as DistributeTokens from '$lib/features/distribute-tokens/components';
	import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
	import BurnTokensForm from './_components/BurnTokensForm.svelte';
	import * as AdminPage from '../_components/admin-page';

	export let data;

	let activeDao = data.activeDao as DAOProject;

	let activeCurrency: string;

	onMount(() => {
		activeCurrency = Object.keys(activeDao.onChainData.treasuryBalances)[0];
	});

	let formDist: Distribution = {
		address: '',
		amount: ''
	};
	let csvDist: Distribution[];

	let distStaging: Distribution[] = [];

	$: availableBalance = Number(activeDao.onChainData.treasuryBalances[activeCurrency]);

	const resetDistribution = () => {
		formDist = {
			address: '',
			amount: ''
		};
		csvDist = [];

		distStaging = [];
	};

	$: if (activeCurrency) resetDistribution();
</script>

<AdminPage.Root>
	<AdminPage.Container>
		<AdminPage.Content>
			<AdminPage.Header>
				<AdminPage.Title>Burn Tokens</AdminPage.Title>
				<AdminPage.Description>
					{`Burn ${activeCurrency} tokens from your treasury.`}
				</AdminPage.Description>
			</AdminPage.Header>
			<DistributeTokens.Tabs>
				{#each Object.entries(activeDao.onChainData.treasuryBalances) as [currency] (currency)}
					<DistributeTokens.Tab {currency} bind:activeCurrency />
				{/each}
			</DistributeTokens.Tabs>
			<DistributeTokens.AvailableBalance {availableBalance} currency={activeCurrency} />
			{#if activeDao.onChainData.treasuryBalances[activeCurrency] != undefined && Number(activeDao.onChainData.treasuryBalances[activeCurrency]) > 0}
				<BurnTokensForm {activeCurrency} daoData={activeDao} />
			{:else}
				<DistributeTokens.NoTokensMessage>
					{`No ${activeCurrency} tokens available to burn.`}
				</DistributeTokens.NoTokensMessage>
			{/if}
		</AdminPage.Content>
	</AdminPage.Container>
</AdminPage.Root>
