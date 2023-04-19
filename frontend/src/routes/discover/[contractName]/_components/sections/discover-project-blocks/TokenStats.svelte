<script lang="ts">
	import { include } from 'vest';
	import DataCard from '$components/cards/DataCard.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { user } from '$stores/flow/FlowStore';

	export let daoData: DAOProject;
</script>

<div class="main-wrapper">
	{#if $user.addr}
		<DataCard
			title="Your Balance"
			data={daoData.userBalance}
			isCurrency
			currencyName={daoData.generalInfo.token_symbol}
			fontSize="var(--font-size-5)"
		/>
	{/if}
	<div class="secondary-wrapper">
		{#if daoData.onChainData.maxSupply}
			<DataCard
				title="Max supply"
				data={Number(daoData.onChainData.maxSupply)}
				isCurrency
				tooltip="The maximum # of tokens allowed. Please note that the project owner could edit this if they wish."
			/>
		{/if}
		<DataCard
			title="Circulating Supply"
			data={Number(daoData.onChainData.totalSupply)}
			isCurrency
			currencyName={daoData.generalInfo.token_symbol}
		/>
		<DataCard title="Total Funding" data={Number(daoData.onChainData.totalFunding)} isCurrency />
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
