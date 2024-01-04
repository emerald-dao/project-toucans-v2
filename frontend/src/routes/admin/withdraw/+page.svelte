<script type="ts">
	import { fly } from 'svelte/transition';
	import type { Writable } from 'svelte/store';
	import { getContext, onMount } from 'svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import * as DistributeTokens from '$lib/features/distribute-tokens/components';
	import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
	import NftDistributionForm from './_components/NFTDistributionForm.svelte';
	import { withdrawTokens } from '$lib/features/distribute-tokens/functions/withdrawTokens';
	import type { ECurrencies } from '$lib/types/common/enums';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	const userDaosStore = adminData.userDaos;

	$: activeDaoData = $userDaosStore[$activeDaoStore];

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

	const handleCreateWithdrawAction = () => {
		withdrawTokens(activeDaoData, distStaging, activeCurrency as ECurrencies);

		resetDistribution();
	};
</script>

<div class="main-wrapper" in:fly={{ x: 10, duration: 400 }}>
	<DistributeTokens.Container grid={activeCurrency !== 'NFTs'}>
		<DistributeTokens.Content>
			<DistributeTokens.Header>
				<DistributeTokens.Title>Distribute Tokens</DistributeTokens.Title>
				<DistributeTokens.Description>
					Distribute treasury tokens to your community members.
				</DistributeTokens.Description>
			</DistributeTokens.Header>
			<DistributeTokens.Tabs>
				{#each Object.entries(activeDaoData.onChainData.treasuryBalances) as [currency] (currency)}
					<DistributeTokens.Tab {currency} bind:activeCurrency />
				{/each}
				<DistributeTokens.Tab currency="NFTs" bind:activeCurrency />
			</DistributeTokens.Tabs>
			{#if activeCurrency != 'NFTs'}
				<DistributeTokens.Form
					{formDist}
					{csvDist}
					{activeCurrency}
					{availableBalance}
					projectOwner={activeDaoData.generalInfo.owner}
					projectId={activeDaoData.generalInfo.project_id}
					bind:distStaging
				/>
			{:else if activeCurrency === 'NFTs'}
				<NftDistributionForm {activeDaoData} />
			{/if}
		</DistributeTokens.Content>
		{#if activeCurrency != 'NFTs'}
			<DistributeTokens.Content>
				<DistributeTokens.Staging bind:distStaging tokenName={activeCurrency} />
				<DistributeTokens.Button
					on:click={handleCreateWithdrawAction}
					disabled={distStaging.length === 0}>Create Withdraw Action</DistributeTokens.Button
				>
			</DistributeTokens.Content>
		{/if}
	</DistributeTokens.Container>
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex: 1;
	}
</style>
