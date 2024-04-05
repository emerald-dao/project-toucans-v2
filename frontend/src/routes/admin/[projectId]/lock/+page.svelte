<script type="ts">
	import LockTokensForm from './_components/LockTokensForm.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import * as DistributeTokens from '$lib/features/distribute-tokens/components';
	import * as AdminPage from '../_components/admin-page';
	import { onMount } from 'svelte';

	export let data;

	let activeDao = data.activeDao as DAOProject;

	let activeCurrency: string;

	onMount(() => {
		activeCurrency = Object.keys(activeDao.onChainData.treasuryBalances)[0];
	});

	$: availableBalance = Number(activeDao.onChainData.treasuryBalances[activeCurrency]);
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
				{#each Object.entries(activeDao.onChainData.treasuryBalances) as [currency] (currency)}
					<DistributeTokens.Tab {currency} bind:activeCurrency />
				{/each}
			</DistributeTokens.Tabs>
			<DistributeTokens.AvailableBalance {availableBalance} currency={activeCurrency} />
			{#if availableBalance && availableBalance > 0}
				<LockTokensForm {activeCurrency} {availableBalance} activeDaoData={activeDao} />
			{:else}
				<DistributeTokens.NoTokensMessage>
					{`No ${activeCurrency} tokens available to lock.`}
				</DistributeTokens.NoTokensMessage>
			{/if}
		</AdminPage.Content>
	</AdminPage.Container>
</AdminPage.Root>
