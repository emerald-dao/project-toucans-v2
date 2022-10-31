<script type="ts">
	import RecapElement from './atoms/RecapElement.svelte';
	import StepButtons from './atoms/StepButtons.svelte';
	import { daoData } from '$stores/generator/DaoDataStore';
	import { Column, Row } from '@mateoroldos/svelte.bones';
	import { TokenTypes } from '$lib/types/token-types.enum';
	import RecapCard from './atoms/RecapCard.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		if ($daoData.daoDetails.logo) {
			displayLogo($daoData.daoDetails.logo[0]);
		}
	});

	const displayLogo = (file: File) => {
		let reader = new FileReader();
		reader.readAsDataURL(file); // base 64 format

		reader.onload = () => {
			logoElement.src = `${reader.result}`;
		};
	};

	let logoElement: HTMLImageElement;
</script>

<Column gap="small">
	<RecapCard title="DAO Details" stepNumber={0}>
		<Row gap="small" align="flex-start">
			{#if $daoData.daoDetails.logo}
				<img bind:this={logoElement} class="logo" alt="Dao logo" />
			{/if}
			<Column gap={1} align="flex-start">
				<RecapElement title="Dao Name" data={$daoData.daoDetails.name} />
				<RecapElement title="Token Name" data={$daoData.daoDetails.tokenName} />
			</Column>
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

<style type="scss">
	img {
		height: 120px;
		aspect-ratio: 1 / 1;
		border-radius: 0.3rem;
		object-fit: contain;
		border: 1px var(--clr-neutral-400) solid;
	}
</style>
