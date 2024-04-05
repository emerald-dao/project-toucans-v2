<script type="ts">
	import { onMount } from 'svelte';
	import * as DistributeTokens from '$lib/features/distribute-tokens/components';
	import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
	import BurnTokensForm from './_components/BurnTokensForm.svelte';
	import * as AdminPage from '../_components/admin-page';

	export let data;

	let activeCurrency: string;

	onMount(() => {
		activeCurrency = Object.keys(data.activeDao.onChainData.treasuryBalances)[0];
	});

	let formDist: Distribution = {
		address: '',
		amount: ''
	};
	let csvDist: Distribution[];

	let distStaging: Distribution[] = [];

	$: availableBalance = Number(data.activeDao.onChainData.treasuryBalances[activeCurrency]);

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
				{#each Object.entries(data.activeDao.onChainData.treasuryBalances) as [currency] (currency)}
					<DistributeTokens.Tab {currency} bind:activeCurrency />
				{/each}
			</DistributeTokens.Tabs>
			<DistributeTokens.AvailableBalance {availableBalance} currency={activeCurrency} />
			{#if data.activeDao.onChainData.treasuryBalances[activeCurrency] != undefined && Number(data.activeDao.onChainData.treasuryBalances[activeCurrency]) > 0}
				<BurnTokensForm {activeCurrency} daoData={data.activeDao} />
			{:else}
				<DistributeTokens.NoTokensMessage>
					{`No ${activeCurrency} tokens available to burn.`}
				</DistributeTokens.NoTokensMessage>
			{/if}
		</AdminPage.Content>
	</AdminPage.Container>
</AdminPage.Root>
