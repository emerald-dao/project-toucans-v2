<script type="ts">
	import NFTDistributionForm from './_components/NFTDistributionForm.svelte';
	import type { Writable } from 'svelte/store';
	import { getContext, onMount } from 'svelte';
	import type { DAOProject, DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
	import * as DistributeTokens from '$lib/features/distribute-tokens/components';
	import * as AdminPage from '../_components/admin-page';
	import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
	import { withdrawTokens } from '$lib/features/distribute-tokens/functions/withdrawTokens';
	import type { ECurrencies } from '$lib/types/common/enums';
	import FungibleTokensDistributionForm from './_components/FungibleTokensDistributionForm.svelte';
	import { getProjectNFTTreasury } from '$flow/actions';

	const adminData: {
		activeDao: Writable<DAOProject>;
		otherDaos: DaoDatabaseData[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	$: activeDaoData = $activeDaoStore;

	let activeCurrency: string;

	onMount(() => {
		activeCurrency = Object.keys(activeDaoData.onChainData.treasuryBalances)[0];
	});

	let formDist: Distribution = {
		address: '',
		amount: ''
	};
	let csvDist: Distribution[];

	let distStaging: Distribution[] = [];

	$: availableBalance = Number(activeDaoData.onChainData.treasuryBalances[activeCurrency]);

	const resetDistribution = () => {
		formDist = {
			address: '',
			amount: ''
		};
		csvDist = [];

		distStaging = [];
	};

	$: if (activeCurrency) resetDistribution();

	const handleCreateWithdrawAction = async () => {
		const actionResult = await withdrawTokens(
			activeDaoData,
			distStaging,
			activeCurrency as ECurrencies
		);

		if (actionResult.state === 'success') {
			resetDistribution();
		}
	};
</script>

<AdminPage.Root>
	<AdminPage.Container grid={activeCurrency !== 'NFTs'}>
		<AdminPage.Content>
			<AdminPage.Header>
				<AdminPage.Title>Distribute Tokens</AdminPage.Title>
				<AdminPage.Description>
					Distribute treasury tokens to your community members.
				</AdminPage.Description>
			</AdminPage.Header>
			<DistributeTokens.Tabs>
				{#each Object.entries(activeDaoData.onChainData.treasuryBalances) as [currency] (currency)}
					<DistributeTokens.Tab {currency} bind:activeCurrency />
				{/each}
				<DistributeTokens.Tab currency="NFTs" bind:activeCurrency />
			</DistributeTokens.Tabs>
			{#if activeCurrency != 'NFTs'}
				<DistributeTokens.AvailableBalance {availableBalance} currency={activeCurrency} />
				{#if availableBalance && Number(availableBalance) > 0}
					<FungibleTokensDistributionForm
						{formDist}
						{csvDist}
						{activeCurrency}
						{availableBalance}
						projectOwner={activeDaoData.generalInfo.owner}
						projectId={activeDaoData.generalInfo.project_id}
						bind:distStaging
					/>
				{:else}
					<DistributeTokens.NoTokensMessage>
						{`No ${activeCurrency} tokens available to distribute.`}
					</DistributeTokens.NoTokensMessage>
				{/if}
			{:else if activeCurrency === 'NFTs'}
				{#if activeDaoData.onChainData.allowedNFTCollections.length > 0}
					<NFTDistributionForm {activeDaoData} />
				{:else}
					<DistributeTokens.NoTokensMessage>
						{`We didn't find any NFT on this treasury.`}
					</DistributeTokens.NoTokensMessage>
				{/if}
			{/if}
		</AdminPage.Content>
		{#if activeCurrency != 'NFTs'}
			<AdminPage.Content>
				<DistributeTokens.Staging bind:distStaging tokenName={activeCurrency} />
				<DistributeTokens.Button
					on:click={handleCreateWithdrawAction}
					disabled={distStaging.length === 0}>Create Withdraw Action</DistributeTokens.Button
				>
			</AdminPage.Content>
		{/if}
	</AdminPage.Container>
</AdminPage.Root>
