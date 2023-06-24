<script lang="ts">
	import DataCard from '$components/cards/DataCard.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { user } from '$stores/flow/FlowStore';
	import { Button } from '@emerald-dao/component-library';
	import { setUpVaultExecution } from '$flow/actions';
	import Icon from '@iconify/svelte';

	export let daoData: DAOProject;
	async function setUpVault() {
		await setUpVaultExecution(daoData.generalInfo.project_id, daoData.generalInfo.contract_address);
		daoData.vaultSetup = true;
	}

	interface HoldingData {
		numHolders: number;
		averageHolding: number;
	}

	interface FundingData {
		numFunders: number;
		averageFunding: number;
	}

	async function calculateFundingData(): Promise<FundingData> {
		const lpAddresses = Object.values(daoData.onChainData.lpAddresses);
		let numFunders, totalFunding;
		numFunders = totalFunding = 0;

		for (const funder in daoData.onChainData.funders) {
			numFunders++;
			totalFunding += Number(daoData.onChainData.funders[funder]);
		}

		let averageFunding = totalFunding / numFunders;
		isNaN(averageFunding) ? (averageFunding = 0) : null;

		return { numFunders, averageFunding };
	}

	async function calculateHoldingData(): Promise<HoldingData> {
		const lpAddresses = Object.values(daoData.onChainData.lpAddresses);
		let numHolders, totalHolding;
		numHolders = totalHolding = 0;

		for (const holder in daoData.onChainData.balances) {
			if (holder === daoData.generalInfo.owner || lpAddresses.includes(holder)) continue;
			numHolders++;
			totalHolding += Number(daoData.onChainData.balances[holder]);
		}

		let averageHolding = totalHolding / numHolders ?? 0;
		isNaN(averageHolding) ? (averageHolding = 0) : null;

		return { numHolders, averageHolding };
	}
</script>

<div class="main-wrapper">
	{#if $user.addr && daoData.hasToken}
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
			{#if daoData.vaultSetup && daoData.userBalance != 0}
				<a
					href={`https://flow.bayou33.app/`}
					target="_blank"
					class="transfer-link header-link"
					rel="noreferrer"
				>
					<img src="/bayou-logo.png" alt="Bayou Logo" width="12" />
					Transfer token
					<Icon icon="tabler:external-link" width="12" />
				</a>
			{/if}
		</DataCard>
	{/if}
	<div class="secondary-wrapper">
		{#if daoData.hasToken && daoData.onChainData.maxSupply}
			<DataCard
				title="Max Supply"
				data={Number(daoData.onChainData.maxSupply)}
				isCurrency
				currencyName={daoData.generalInfo.token_symbol}
				tooltip="The maximum # of tokens allowed. Please note that the project owner could edit this if they wish."
			/>
		{/if}
		{#if daoData.hasToken}
			<DataCard
				title="Total Supply"
				data={Number(daoData.onChainData.totalSupply)}
				isCurrency
				currencyName={daoData.generalInfo.token_symbol}
			/>
		{/if}
		<DataCard
			title="Total Funding"
			data={Number(daoData.onChainData.totalFunding)}
			currencyName={daoData.onChainData.paymentCurrency}
			isCurrency
		/>
	</div>
	<div class="secondary-wrapper-small">
		{#if daoData.hasToken}
			{#await calculateHoldingData() then tokenData}
				<DataCard title="Unique Holders" data={tokenData.numHolders} />
				<DataCard
					title="Average Holding"
					data={tokenData.averageHolding}
					isCurrency
					currencyName={daoData.generalInfo.token_symbol}
				/>
			{/await}
		{/if}
		{#await calculateFundingData() then tokenData}
			<DataCard title="Unique Funders" data={tokenData.numFunders} />
			<DataCard
				title="Average Funding"
				data={tokenData.averageFunding}
				isCurrency
				currencyName={daoData.onChainData.paymentCurrency}
			/>
		{/await}
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

		.secondary-wrapper-small {
			display: grid;
			gap: var(--space-5);
			grid-template-columns: 1fr 1fr;

			@include mq('small') {
				display: flex;
				flex-direction: row;
			}
		}
	}
	.transfer-link {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--font-size-1) !important;
	}

	.header-link {
		font-size: var(--font-size-3);
	}
</style>
