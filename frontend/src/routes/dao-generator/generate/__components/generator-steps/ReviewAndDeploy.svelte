<script type="ts">
	import RecapElement from './atoms/RecapElement.svelte';
	import StepButtons from './atoms/StepButtons.svelte';
	import { daoData } from '$stores/generator/DaoDataStore';
	import { TokenTypes } from '$lib/types/token-types.enum';
	import RecapCard from './atoms/RecapCard.svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

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

<div class="column-6" in:fly="{{ y: 30, duration: 400 }}">
	<RecapCard title="DAO Details" stepNumber={0}>
		<div class="row-5">
			{#if $daoData.daoDetails.logo}
				<img bind:this={logoElement} class="logo" alt="Dao logo" />
			{/if}
			<div class="column">
				<RecapElement title="Dao Name" data={$daoData.daoDetails.name} />
				<RecapElement title="Token Name" data={$daoData.daoDetails.tokenName} />
			</div>
		</div>
		<RecapElement title="Description" data={$daoData.daoDetails.description} />
		{#if $daoData.daoDetails.website}
			<RecapElement title="Website" data={$daoData.daoDetails.website} />
		{/if}
		{#if $daoData.daoDetails.twitter}
			<RecapElement title="Twitter" data={$daoData.daoDetails.twitter} />
		{/if}
		{#if $daoData.daoDetails.discord && $daoData.daoDetails.discord !== 'https://discord.gg/'}
			<RecapElement title="Discord" data={$daoData.daoDetails.discord} />
		{/if}
	</RecapCard>
	<RecapCard title="Token" stepNumber={1}>
		<RecapElement title="Token type" data={$daoData.tokenomics.tokenType} />
	</RecapCard>
	<RecapCard title="Tokenomics" stepNumber={2}>
		{#if $daoData.tokenomics.tokenType === TokenTypes.FINANCIAL}
			<RecapElement title="Target amount" data={$daoData.tokenomics.targetAmount} />
			<RecapElement
				title="Issuance rate"
				data={`${$daoData.tokenomics.initialRound.issuanceRate} ${$daoData.daoDetails.tokenName} = 1 ${$daoData.tokenomics.initialRound.token}`}
			/>
			<RecapElement
				title="Reserve rate"
				data={$daoData.tokenomics.initialRound.reserveRate + '%'}
			/>
		{:else if $daoData.tokenomics.tokenType === TokenTypes.COMMUNITY}
			<RecapElement title="Total supply" data={$daoData.tokenomics.totalSupply} />
		{/if}
		<div class="row-6">
			<RecapElement title="Token minting" data={$daoData.tokenomics.mintTokens} />
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
