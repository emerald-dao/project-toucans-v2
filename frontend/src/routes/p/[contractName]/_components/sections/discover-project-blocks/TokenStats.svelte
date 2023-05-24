<script lang="ts">
	import { include } from 'vest';
	import DataCard from '$components/cards/DataCard.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { user } from '$stores/flow/FlowStore';
	import { Button } from '@emerald-dao/component-library';
	import { setUpVaultExecution } from '$flow/actions';

	export let daoData: DAOProject;
	async function setUpVault() {
		await setUpVaultExecution(daoData.generalInfo.project_id, daoData.generalInfo.contract_address);
		daoData.vaultSetup = true;
	}
</script>

<div class="main-wrapper">
	{#if $user.addr}
		<DataCard
			title="Your Balance"
			data={daoData.userBalance}
			isCurrency
			currencyName={daoData.generalInfo.token_symbol}
			fontSize="var(--font-size-5)"
		>
			{#if !daoData.vaultSetup}
				<Button
					size="x-small"
					type="ghost"
					color="neutral"
					on:click={setUpVault}
					title="Setup a vault so you can receive tokens"
				>
					Set Up Vault
				</Button>
			{/if}
		</DataCard>
	{/if}
	<div class="secondary-wrapper">
		{#if daoData.onChainData.maxSupply}
			<DataCard
				title="Max Supply"
				data={Number(daoData.onChainData.maxSupply)}
				isCurrency
				currencyName={daoData.generalInfo.token_symbol}
				tooltip="The maximum # of tokens allowed. Please note that the project owner could edit this if they wish."
			/>
		{/if}
		<DataCard
			title="Circulating Supply"
			data={Number(daoData.onChainData.totalSupply)}
			isCurrency
			currencyName={daoData.generalInfo.token_symbol}
		/>
		<DataCard
			title="Total Funding"
			data={Number(daoData.onChainData.totalFunding)}
			currencyName={daoData.onChainData.paymentCurrency}
			isCurrency
		/>
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);

		.secondary-wrapper {
			display: flex;
			gap: var(--space-5);
			flex-direction: column;

			@include mq('small') {
				flex-direction: row;
			}
		}
	}
</style>
