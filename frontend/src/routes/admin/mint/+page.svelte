<script type="ts">
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import * as DistributeTokens from '$lib/features/distribute-tokens/components';
	import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
	import FungibleTokensDistributionForm from '../withdraw/_components/FungibleTokensDistributionForm.svelte';
	import { mintTokens } from '$lib/features/distribute-tokens/functions/mintTokens';
	import * as AdminPage from '../_components/admin-page';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	const userDaosStore = adminData.userDaos;

	$: activeDaoData = $userDaosStore[$activeDaoStore];

	$: availableBalance = activeDaoData.onChainData.maxSupply
		? Number(activeDaoData.onChainData.maxSupply) - Number(activeDaoData.onChainData.totalSupply)
		: ('infinite' as const);

	let formDist: Distribution = {
		address: '',
		amount: ''
	};
	let csvDist: Distribution[];

	let distStaging: Distribution[] = [];

	const resetDistribution = () => {
		formDist = {
			address: '',
			amount: ''
		};

		distStaging = [];
	};

	const handleCreateMintAction = async () => {
		const actionResult = await mintTokens(activeDaoData, distStaging);

		if (actionResult.state === 'success') {
			resetDistribution();
		}
	};
</script>

<AdminPage.Root>
	{#if activeDaoData.generalInfo.token_symbol}
		<AdminPage.Container>
			<AdminPage.Content>
				<AdminPage.Header>
					<AdminPage.Title>Mint Tokens</AdminPage.Title>
					<AdminPage.Description>
						{`Mint $${activeDaoData.generalInfo.token_symbol} tokens to external wallets.`}
					</AdminPage.Description>
				</AdminPage.Header>
				<DistributeTokens.AvailableBalance
					{availableBalance}
					currency={activeDaoData.generalInfo.token_symbol}
				/>
				{#if (availableBalance && Number(availableBalance) > 0) || availableBalance === 'infinite'}
					<FungibleTokensDistributionForm
						{formDist}
						{csvDist}
						activeCurrency={activeDaoData.generalInfo.token_symbol}
						{availableBalance}
						projectOwner={activeDaoData.generalInfo.owner}
						projectId={activeDaoData.generalInfo.project_id}
						bind:distStaging
					/>
				{:else}
					<DistributeTokens.NoTokensMessage>
						{`No ${activeDaoData.generalInfo.token_symbol} tokens available to mint.`}
					</DistributeTokens.NoTokensMessage>
				{/if}
			</AdminPage.Content>
			<AdminPage.Content>
				<DistributeTokens.Staging
					bind:distStaging
					tokenName={activeDaoData.generalInfo.token_symbol}
				/>
				<DistributeTokens.Button
					on:click={handleCreateMintAction}
					disabled={distStaging.length === 0}>Create Mint Action</DistributeTokens.Button
				>
			</AdminPage.Content>
		</AdminPage.Container>
	{/if}
</AdminPage.Root>
