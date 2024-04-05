<script type="ts">
	import LockTokensForm from './_components/LockTokensForm.svelte';
	import * as DistributeTokens from '$lib/features/distribute-tokens/components';
	import * as AdminPage from '../_components/admin-page';
	import { onMount } from 'svelte';

	export let data;

	let activeCurrency: string;

	onMount(() => {
		activeCurrency = Object.keys(data.activeDao.onChainData.treasuryBalances)[0];
	});

	$: availableBalance = Number(data.activeDao.onChainData.treasuryBalances[activeCurrency]);
</script>

<AdminPage.Root>
	<AdminPage.Container>
		<AdminPage.Content>
			<AdminPage.Header>
				<AdminPage.Title>Lock Tokens</AdminPage.Title>
				<AdminPage.Description>
					Lock tokens from your treasury to external wallets so they can claim later.
				</AdminPage.Description>
			</AdminPage.Header>
			<DistributeTokens.Tabs>
				{#each Object.entries(data.activeDao.onChainData.treasuryBalances) as [currency] (currency)}
					<DistributeTokens.Tab {currency} bind:activeCurrency />
				{/each}
			</DistributeTokens.Tabs>
			<DistributeTokens.AvailableBalance {availableBalance} currency={activeCurrency} />
			{#if availableBalance && availableBalance > 0}
				<LockTokensForm {activeCurrency} {availableBalance} activeDaoData={data.activeDao} />
			{:else}
				<DistributeTokens.NoTokensMessage>
					{`No ${activeCurrency} tokens available to lock.`}
				</DistributeTokens.NoTokensMessage>
			{/if}
		</AdminPage.Content>
	</AdminPage.Container>
</AdminPage.Root>
