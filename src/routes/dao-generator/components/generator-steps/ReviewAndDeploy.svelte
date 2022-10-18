<script type="ts">
	import Card from '$components/atoms/Card.svelte';
	import { daoData } from '$stores/generator/DaoDataStore';
	import { Column, Row } from '@mateoroldos/svelte.bones';
	import { TokenTypes } from '$lib/types/token-types.enum';
	import RecapCard from './atoms/RecapCard.svelte';
</script>

<Column gap="small">
	<RecapCard title="DAO Details" stepNumber={0}>
		<Row>
			<h5>{$daoData.daoDetails.name}</h5>
			<span>{$daoData.daoDetails.tokenName}</span>
		</Row>
		<p>{$daoData.daoDetails.description}</p>
		<span>{$daoData.daoDetails.website}</span>
	</RecapCard>
	<RecapCard title="Token Type" stepNumber={1}>
		<h5>{$daoData.tokenomics.tokenType}</h5>
	</RecapCard>
	<RecapCard title="Tokenomics" stepNumber={2}>
		{#if $daoData.tokenomics.tokenType === TokenTypes.FINANCIAL}
			<h5>{$daoData.tokenomics.initialRound.targetAmount} raise</h5>
			<span
				>{`${$daoData.tokenomics.initialRound.targetAmount} ${$daoData.daoDetails.tokenName} = 1 ${$daoData.tokenomics.initialRound.token}`}</span
			>
			<span>{`${$daoData.tokenomics.initialRound.reserveRate}% reserve rate`}</span>
		{:else if $daoData.tokenomics.tokenType === TokenTypes.COMMUNITY}
			<h5>{$daoData.tokenomics.totalSupply}</h5>
		{/if}
		<span>{`Token burning ${$daoData.tokenomics.burnTokens}`}</span>
		<span>{`Token minting ${$daoData.tokenomics.mintTokens}`}</span>
	</RecapCard>
</Column>
