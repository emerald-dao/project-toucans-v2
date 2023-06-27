<script lang="ts">
	import { setUpVaultExecution } from '$flow/actions';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button, Currency } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let daoData: DAOProject;

	async function setUpVault() {
		await setUpVaultExecution(daoData.generalInfo.project_id, daoData.generalInfo.contract_address);
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
	{#if daoData.vaultSetup && daoData.userBalance && daoData.userBalance > 0}
		<div class="row-4">
			<Button href={`https://flow.bayou33.app/`} target="_blank" color="neutral" size="small">
				<Icon icon="tabler:arrow-up-right" />
				Transfer
			</Button>
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
