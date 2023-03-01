<script type="ts">
	import RecapElement from './atoms/RecapElement.svelte';
	import StepButtons from './atoms/StepButtons.svelte';
	import { daoGeneratorData } from '$stores/generator/DaoDataStore';
	import { TokenTypes } from '$lib/types/token-types.enum';
	import RecapCard from './atoms/RecapCard.svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { generatorActiveStep } from '$stores/generator/GeneratorSteps';

	onMount(() => {
		if ($daoGeneratorData.daoDetails.logo) {
			displayLogo($daoGeneratorData.daoDetails.logo[0]);
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

	console.log($daoGeneratorData);
	
</script>

<div class="column-6" in:fly="{{ y: 30, duration: 400 }}">
	<RecapCard title="DAO Details" onEdit={() => generatorActiveStep.goToStep(0)}>
		<div class="row-5">
			{#if $daoGeneratorData.daoDetails.logo}
				<img bind:this={logoElement} class="logo" alt="Dao logo" />
			{/if}
			<div class="column">
				<RecapElement title="Dao Name" data={$daoGeneratorData.daoDetails.name} />
				<RecapElement title="Token Name" data={$daoGeneratorData.daoDetails.tokenName} />
			</div>
		</div>
		<RecapElement title="Description" data={$daoGeneratorData.daoDetails.description} />
		{#if $daoGeneratorData.daoDetails.website}
			<RecapElement title="Website" data={$daoGeneratorData.daoDetails.website} />
		{/if}
		{#if $daoGeneratorData.daoDetails.twitter}
			<RecapElement title="Twitter" data={$daoGeneratorData.daoDetails.twitter} />
		{/if}
		{#if $daoGeneratorData.daoDetails.discord && $daoGeneratorData.daoDetails.discord !== 'https://discord.gg/'}
			<RecapElement title="Discord" data={$daoGeneratorData.daoDetails.discord} />
		{/if}
	</RecapCard>
	<RecapCard title="Token" onEdit={() => generatorActiveStep.goToStep(1)}>
		<RecapElement title="Token type" data={$daoGeneratorData.tokenomics.tokenType} />
	</RecapCard>
	<RecapCard title="Tokenomics" onEdit={() => generatorActiveStep.goToStep(2)}>
		{#if $daoGeneratorData.tokenomics.tokenType === TokenTypes.FINANCIAL}
			<RecapElement title="Target amount" data={$daoGeneratorData.tokenomics.initialRound.fundingGoal} />
			<RecapElement
				title="Issuance rate"
				data={`${$daoGeneratorData.tokenomics.initialRound.issuanceRate} ${$daoGeneratorData.daoDetails.tokenName} = 1 ${$daoGeneratorData.tokenomics.initialRound.token}`}
			/>
			<RecapElement
				title="Reserve rate"
				data={$daoGeneratorData.tokenomics.initialRound.reserveRate + '%'}
			/>
		{:else if $daoGeneratorData.tokenomics.tokenType === TokenTypes.COMMUNITY}
			<RecapElement title="Total supply" data={$daoGeneratorData.tokenomics.totalSupply} />
		{/if}
		<div class="row-6">
			<RecapElement title="Token minting" data={$daoGeneratorData.tokenomics.mintTokens} />
		</div>
	</RecapCard>
</div>
<StepButtons />

<style type="scss">
	img {
		height: 120px;
		aspect-ratio: 1 / 1;
		border-radius: 0.3rem;
		object-fit: contain;
		border: 1px var(--clr-border-primary) solid;
	}
</style>
