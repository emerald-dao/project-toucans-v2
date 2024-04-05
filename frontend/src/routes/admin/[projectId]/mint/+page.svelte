<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import * as DistributeTokens from '$lib/features/distribute-tokens/components';
	import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
	import FungibleTokensDistributionForm from '../withdraw/_components/FungibleTokensDistributionForm.svelte';
	import { mintTokens } from '$lib/features/distribute-tokens/functions/mintTokens';
	import * as AdminPage from '../_components/admin-page';

	export let data;

	let activeDao = data.activeDao as DAOProject;

	$: availableBalance = activeDao.onChainData.maxSupply
		? Number(activeDao.onChainData.maxSupply) - Number(activeDao.onChainData.totalSupply)
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
		const actionResult = await mintTokens(activeDao, distStaging);

		if (actionResult.state === 'success') {
			resetDistribution();
		}
	};
</script>

<AdminPage.Root>
	{#if activeDao.generalInfo.token_symbol}
		<AdminPage.Container>
			<AdminPage.Content>
				<AdminPage.Header>
					<AdminPage.Title>Mint Tokens</AdminPage.Title>
					<AdminPage.Description>
						{`Mint $${activeDao.generalInfo.token_symbol} tokens to external wallets.`}
					</AdminPage.Description>
				</AdminPage.Header>
				<DistributeTokens.AvailableBalance
					{availableBalance}
					currency={activeDao.generalInfo.token_symbol}
				/>
				{#if (availableBalance && Number(availableBalance) > 0) || availableBalance === 'infinite'}
					<FungibleTokensDistributionForm
						{formDist}
						{csvDist}
						activeCurrency={activeDao.generalInfo.token_symbol}
						{availableBalance}
						projectOwner={activeDao.generalInfo.owner}
						projectId={activeDao.generalInfo.project_id}
						bind:distStaging
					/>
				{:else}
					<DistributeTokens.NoTokensMessage>
						{`No ${activeDao.generalInfo.token_symbol} tokens available to mint.`}
					</DistributeTokens.NoTokensMessage>
				{/if}
			</AdminPage.Content>
			<AdminPage.Content>
				<DistributeTokens.Staging bind:distStaging tokenName={activeDao.generalInfo.token_symbol} />
				<DistributeTokens.Button
					on:click={handleCreateMintAction}
					disabled={distStaging.length === 0}>Create Mint Action</DistributeTokens.Button
				>
			</AdminPage.Content>
		</AdminPage.Container>
	{/if}
</AdminPage.Root>
