<script lang="ts">
	import { setUpVaultExecution } from '$flow/actions';
	import TransferModal from '$lib/features/transfer-tokens/components/TransferModal.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button, Currency } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let daoData: DAOProject;
	export let reloadUserBalance: () => void;

	async function setUpVault() {
		await setUpVaultExecution(daoData.generalInfo.project_id, daoData.generalInfo.contract_address as string);
		daoData.vaultSetup = true;
	}
</script>

<div class="main-wrapper row-8 align-end">
	<div class="column-3">
		<span class="small"> Your Balance </span>
		<Currency
			amount={daoData.userBalance ?? 0}
			currency={daoData.generalInfo.token_symbol}
			fontSize="var(--font-size-7)"
			color="heading"
			decimalNumbers={2}
		/>
	</div>
	{#if daoData.generalInfo.token_symbol && daoData.generalInfo.logo && daoData.generalInfo.name && daoData.vaultSetup && daoData.userBalance && daoData.userBalance > 0}
		<div class="row-4">
			<TransferModal
				tokenSymbol={daoData.generalInfo.token_symbol}
				daoName={daoData.generalInfo.name}
				contractAddress={daoData.generalInfo.contract_address}
				projectId={daoData.generalInfo.project_id}
				logoUrl={daoData.generalInfo.logo}
				userBalance={daoData.userBalance}
				on:transferSuccess={reloadUserBalance}
			/>
		</div>
	{:else if !daoData.vaultSetup}
		<Button
			size="small"
			color="primary"
			on:click={setUpVault}
			title="Setup a vault so you can receive tokens"
		>
			<Icon icon="tabler:wallet" />
			Set Up Vault
		</Button>
	{/if}
</div>

<style lang="scss">
	.main-wrapper {
		padding-bottom: var(--space-3);
		padding-inline: var(--space-3);
	}
</style>
