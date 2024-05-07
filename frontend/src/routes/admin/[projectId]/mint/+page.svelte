<script type="ts">
	import * as DistributeTokens from '$lib/features/distribute-tokens/components';
	import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
	import FungibleTokensDistributionForm from '../withdraw/_components/FungibleTokensDistributionForm.svelte';
	import { mintTokens } from '$lib/features/distribute-tokens/functions/mintTokens';
	import * as AdminPage from '../_components/admin-page';

	export let data;

	$: availableBalance = data.activeDao.onChainData.maxSupply
		? Number(data.activeDao.onChainData.maxSupply) - Number(data.activeDao.onChainData.totalSupply)
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
		const actionResult = await mintTokens(data.activeDao, distStaging);

		if (actionResult.state === 'success') {
			resetDistribution();
		}
	};
</script>

<AdminPage.Root>
	{#if data.activeDao.generalInfo.token_symbol}
		<AdminPage.Container>
			<AdminPage.Content>
				<AdminPage.Header>
					<AdminPage.Title>Mint Tokens</AdminPage.Title>
					<AdminPage.Description>
						{`Mint $${data.activeDao.generalInfo.token_symbol} tokens to external wallets.`}
					</AdminPage.Description>
				</AdminPage.Header>
				<DistributeTokens.AvailableBalance
					{availableBalance}
					currency={data.activeDao.generalInfo.token_symbol}
				/>
				{#if (availableBalance && Number(availableBalance) > 0) || availableBalance === 'infinite'}
					<FungibleTokensDistributionForm
						{formDist}
						{csvDist}
						activeCurrency={data.activeDao.generalInfo.token_symbol}
						{availableBalance}
						contractAddress={data.activeDao.generalInfo.contract_address}
						projectId={data.activeDao.generalInfo.project_id}
						bind:distStaging
					/>
				{:else}
					<DistributeTokens.NoTokensMessage>
						{`No ${data.activeDao.generalInfo.token_symbol} tokens available to mint.`}
					</DistributeTokens.NoTokensMessage>
				{/if}
			</AdminPage.Content>
			<AdminPage.Content>
				<DistributeTokens.Staging
					bind:distStaging
					tokenName={data.activeDao.generalInfo.token_symbol}
				/>
				<DistributeTokens.Button
					on:click={handleCreateMintAction}
					disabled={distStaging.length === 0}>Create Mint Action</DistributeTokens.Button
				>
			</AdminPage.Content>
		</AdminPage.Container>
	{/if}
</AdminPage.Root>
