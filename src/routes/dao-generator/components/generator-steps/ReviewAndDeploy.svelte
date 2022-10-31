<script type="ts">
	import RecapElement from './atoms/RecapElement.svelte';
	import StepButtons from './atoms/StepButtons.svelte';
	import { daoData } from '$stores/generator/DaoDataStore';
	import { Column, Row } from '@mateoroldos/svelte.bones';
	import { TokenTypes } from '$lib/types/token-types.enum';
	import RecapCard from './atoms/RecapCard.svelte';
</script>

<Column gap="small">
	<RecapCard title="DAO Details" stepNumber={0}>
		<Row gap="small">
			<RecapElement title="Dao Name" data={$daoData.daoDetails.name} />
			<RecapElement title="Token Name" data={$daoData.daoDetails.tokenName} />
		</Row>
		<RecapElement title="Description" data={$daoData.daoDetails.description} />
		<RecapElement title="Website" data={$daoData.daoDetails.website} />
	</RecapCard>
	<RecapCard title="Token Type" stepNumber={1}>
		<RecapElement data={$daoData.tokenomics.tokenType} />
	</RecapCard>
	<RecapCard title="Tokenomics" stepNumber={2}>
		{#if $daoData.tokenomics.tokenType === TokenTypes.FINANCIAL}
			<RecapElement title="Target amount" data={$daoData.tokenomics.initialRound.targetAmount} />
			<RecapElement
				title="Issuance rate"
				data={`${$daoData.tokenomics.initialRound.targetAmount} ${$daoData.daoDetails.tokenName} = 1 ${$daoData.tokenomics.initialRound.token}`}
			/>
			<RecapElement title="Reserve rate" data={$daoData.tokenomics.initialRound.reserveRate} />
		{:else if $daoData.tokenomics.tokenType === TokenTypes.COMMUNITY}
			<RecapElement title="Total supply" data={$daoData.tokenomics.totalSupply} />
		{/if}
		<Row gap="small">
			<RecapElement title="Token burning" data={$daoData.tokenomics.burnTokens} />
			<RecapElement title="Token minting" data={$daoData.tokenomics.mintTokens} />
		</Row>
	</RecapCard>
</Column>
<StepButtons />
