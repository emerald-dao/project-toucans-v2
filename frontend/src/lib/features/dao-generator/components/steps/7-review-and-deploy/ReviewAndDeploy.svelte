<script type="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { RecapCard, StepButtons, RecapElement } from '../../index';
	import { editDelayOptions } from '../6-edit-delay/editDelayOptions';
	import { getContext } from 'svelte';
	import type { createActiveStep } from '$stores/custom/steps/ActiveStep';
	import type { daoGeneratorData as TdaoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
	import type { daoAndTokenGeneratorData } from '$lib/features/dao-generator/stores/DaoAndTokenGeneratorData';

	const daoGeneratorData: typeof TdaoGeneratorData | typeof daoAndTokenGeneratorData =
		getContext('daoGeneratorData');
	const generatorActiveStep: ReturnType<typeof createActiveStep> =
		getContext('daoGeneratorActiveStep');

	onMount(() => {
		if ($daoGeneratorData.daoDetails.logo) {
			displayLogo($daoGeneratorData.daoDetails.logo[0]);
		}
	});

	let logoElement: string;

	const displayLogo = (file: File) => {
		let reader = new FileReader();
		reader.readAsDataURL(file); // base 64 format

		reader.onload = (e) => {
			logoElement = e.target?.result as string;
		};
	};

	// let logoElement: HTMLImageElement;
</script>

<div class="column-6" in:fly={{ y: 30, duration: 400 }}>
	<RecapCard title="Overview" onEdit={() => generatorActiveStep.goToStep(0)}>
		<div class="row-5">
			{#if logoElement}
				<img src={logoElement} class="logo" alt="DAO Logo" />
			{/if}
			<div class="column">
				<RecapElement title="DAO Name" data={$daoGeneratorData.daoDetails.name} />
				{#if $daoGeneratorData.daoDetails.daoType === 'daoAndToken'}
					<RecapElement title="Token Name" data={$daoGeneratorData.daoDetails.tokenName} />
				{/if}
			</div>
		</div>
		<RecapElement title="Description" data={$daoGeneratorData.daoDetails.description} />
		{#if $daoGeneratorData.daoDetails.website}
			<RecapElement title="Website" data={'https://' + $daoGeneratorData.daoDetails.website} />
		{/if}
		{#if $daoGeneratorData.daoDetails.twitter}
			<RecapElement title="Twitter" data={'@' + $daoGeneratorData.daoDetails.twitter} />
		{/if}
		{#if $daoGeneratorData.daoDetails.discord}
			<RecapElement
				title="Discord"
				data={'https://discord.gg/' + $daoGeneratorData.daoDetails.discord}
			/>
		{/if}
		{#if $daoGeneratorData.daoDetails.daoType === 'daoAndToken'}
			<RecapElement
				title="Edit Delay"
				data={editDelayOptions.filter(
					(delay) => delay.value === $daoGeneratorData.tokenomics.editDelay
				)[0].title}
			/>
			<!-- <RecapElement title="Token minting" data={$daoGeneratorData.tokenomics.mintTokens} /> -->
		{/if}
	</RecapCard>
</div>
<StepButtons active={true} />

<style type="scss">
	img {
		height: 120px;
		aspect-ratio: 1 / 1;
		border-radius: 0.3rem;
		object-fit: cover;
		border: 1px var(--clr-border-primary) solid;
	}
</style>
