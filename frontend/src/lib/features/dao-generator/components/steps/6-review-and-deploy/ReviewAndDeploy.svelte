<script type="ts">
	import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { generatorActiveStep } from '$lib/features/dao-generator/stores/DaoGeneratorSteps';
	import { RecapCard, StepButtons, RecapElement } from '../../index';
	import { editDelayOptions } from '../5-edit-delay/editDelayOptions';
	import { getFlowBalance } from '$flow/actions';
	import { user } from '$stores/flow/FlowStore';

	onMount(() => {
		if ($daoGeneratorData.daoDetails.logo) {
			displayLogo($daoGeneratorData.daoDetails.logo[0]);
		}
	});

	let logoElement;

	const displayLogo = (file: File) => {
		let reader = new FileReader();
		reader.readAsDataURL(file); // base 64 format

		reader.onload = (e) => {
			logoElement = e.target.result;
		};
	};

	// let logoElement: HTMLImageElement;
	let confirmCost: boolean = false;

	async function getUserBalance() {
		const balance = await getFlowBalance($user.addr);
		return Math.round(Number(balance) * 100) / 100;
	}
</script>

{#await getUserBalance() then balance}
	<div class="column-6" in:fly={{ y: 30, duration: 400 }}>
		<RecapCard title="Overview" onEdit={() => generatorActiveStep.goToStep(0)}>
			<div class="row-5">
				{#if logoElement}
					<img src={logoElement} class="logo" alt="DAO Logo" />
				{/if}
				<div class="column">
					<RecapElement title="DAO Name" data={$daoGeneratorData.daoDetails.name} />
					<RecapElement title="Token Name" data={$daoGeneratorData.daoDetails.tokenName} />
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
			<RecapElement
				title="Edit Delay"
				data={editDelayOptions.filter(
					(delay) => delay.value === $daoGeneratorData.tokenomics.editDelay
				)[0].title}
			/>
			<RecapElement title="Token minting" data={$daoGeneratorData.tokenomics.mintTokens} />
		</RecapCard>
		<div class="column-2">
			<label for="confirm-cost" class="switch">
				<input type="checkbox" name="confirm-cost" id="confirm-cost" bind:checked={confirmCost} />
				<span class="slider" />
				I confirm this will cost 100 $FLOW token.
			</label>
			<span class="xsmall">You have a current balance of {balance} $FLOW.</span>
		</div>
	</div>
	<StepButtons active={confirmCost && balance >= 100.1} />
{/await}

<style type="scss">
	img {
		height: 120px;
		aspect-ratio: 1 / 1;
		border-radius: 0.3rem;
		object-fit: cover;
		border: 1px var(--clr-border-primary) solid;
	}
</style>
