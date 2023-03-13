<script lang="ts">
	import DataCard from '$components/cards/DataCard.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { user } from '$stores/flow/FlowStore';

	export let daoData: DAOProject;
</script>

<div class="main-wrapper">
	{#if $user.addr}
		<div class="your-balance">
			<DataCard
				title="Your Balance"
				data={daoData.userBalance}
				isCurrency
				currencyName={daoData.generalInfo.token_symbol}
				fontSize="var(--font-size-5)"
			/>
		</div>
	{/if}
	<div class="circulating">
		<DataCard
			title="Circulating Supply"
			data={Number(daoData.onChainData.totalSupply)}
			isCurrency
			currencyName={daoData.generalInfo.token_symbol}
		/>
	</div>
	<div class="funding">
		<DataCard title="Total Funding" data={Number(daoData.onChainData.totalFunding)} isCurrency />
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		column-gap: var(--space-5);

		@include mq(small) {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(2, auto);
			grid-template-areas: 'your-balance your-balance' 'circulating funding';

			.your-balance {
				grid-area: your-balance;
				margin-bottom: var(--space-5);
			}

			.circulating {
				grid-area: circulating;
			}

			.funding {
				grid-area: funding;
			}
		}
	}
</style>
