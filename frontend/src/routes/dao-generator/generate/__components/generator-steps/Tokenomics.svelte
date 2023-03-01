<script type="ts">
	import RecapElement from './atoms/RecapElement.svelte';
	import type { FinancialDaoGeneratorData } from '$lib/types/dao-generator/dao-generator-data.interface';
	import RoundGeneratorModal from '$components/round-generator/RoundGeneratorModal.svelte';
	import { fly } from 'svelte/transition';
	import StepButtons from './atoms/StepButtons.svelte';
	import { InputWrapper } from '@emerald-dao/component-library';
	import { daoGeneratorData } from '$stores/generator/DaoDataStore';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';
	import tokenomicsSuite from '$lib/validations/tokenomicsSuite';
	import { TokenTypes } from '$lib/types/common/token-types.enum';
	import { Currencies } from '$lib/types/currencies.enum';
	import RecapCard from './atoms/RecapCard.svelte';
	import type { Writable } from 'svelte/store';

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		if (target?.name) {
			res = tokenomicsSuite($daoGeneratorData.tokenomics, target.name);
		}
	};

	let res = tokenomicsSuite.get();

	const deleteRound = () => {
		$daoGeneratorData.tokenomics.initialRound = {
			infiniteDuration: false,
			infiniteFundingGoal: false,
			startDate: '',
			endDate: '',
			projectId: '',
			fundingGoal: undefined,
			currency: Currencies.FLOW,
			distributionList: [],
			issuanceRate: undefined,
			reserveRate: undefined
		};
	}

	let editMode = false;
</script>

{#if $daoGeneratorData.tokenomics.tokenType === TokenTypes.FINANCIAL}
	<div class="column-4" in:fly={{ y: 30, duration: 400 }}>
		{#if $daoGeneratorData.tokenomics.initialRound.startDate != ""}
			<div in:fly|local={{ y: 40, duration: 400 }}>
				<RecapCard title="Initial round" onClean={deleteRound} onEdit={() => editMode = true}>
					<RecapElement title="Start date" data={$daoGeneratorData.tokenomics.initialRound.startDate.toLocaleString()} />
					{#if !$daoGeneratorData.tokenomics.initialRound.infiniteDuration}
						<RecapElement title="End date" data={$daoGeneratorData.tokenomics.initialRound.endDate.toLocaleString()} />
					{/if}
					{#if !$daoGeneratorData.tokenomics.initialRound.infiniteFundingGoal}
						<RecapElement title="Funding goal" data={`$${$daoGeneratorData.tokenomics.initialRound.currency} ${$daoGeneratorData.tokenomics.initialRound.fundingGoal?.toLocaleString()}`} />
					{:else}
						<RecapElement title="Funding goal" data={`Infinite`} />
					{/if}
					<RecapElement title="Issuance rate" data={`$${$daoGeneratorData.daoDetails.tokenName} ${$daoGeneratorData.tokenomics.initialRound.issuanceRate?.toLocaleString()} = $${$daoGeneratorData.tokenomics.initialRound.currency} ${'1'.toLocaleString()}`} />
					<RecapElement title="Reserve rate" data={$daoGeneratorData.tokenomics.initialRound.reserveRate} />
				</RecapCard>
			</div>
			{#if editMode}
				<RoundGeneratorModal daoData={$daoGeneratorData} open={true} on:close={() => editMode = false}/>
			{/if}
		{:else if $daoGeneratorData.tokenomics.initialRound.startDate === ""}
			<div in:fly|local={{ y: 40, duration: 400 }} class="column align-center">
				<p>In order to gather funds you have to create a funding round.</p>
				<p>You can create it now or create it afterwards in the admin dashboard.</p>
				<RoundGeneratorModal daoData={$daoGeneratorData}/>
			</div>
		{/if}
		<StepButtons/>
	</div>
{:else if $daoGeneratorData.tokenomics.tokenType === TokenTypes.COMMUNITY}
	<form
		id={$generatorSteps[$generatorActiveStep].slug}
		on:submit|preventDefault={generatorActiveStep.increment}
		autocomplete="off"
		in:fly={{ y: 30, duration: 400 }}
	>
		<InputWrapper
			name="supply"
			label="Total supply"
			errors={res.getErrors('supply')}
			isValid={res.isValid('supply')}
			tooltip="Lorem ipsum helper text"
		>
			<input
				type="text"
				name="supply"
				placeholder="e.g. 1000000"
				bind:value={$daoGeneratorData.tokenomics.totalSupply}
				on:input={handleChange}
			/>
		</InputWrapper>
		<StepButtons active={res.isValidByGroup($daoGeneratorData.tokenomics.tokenType)} />
	</form>
{/if}

<style type="scss">
	form {
		display: flex;
		flex-direction: column;

		.range-wrapper {
			margin-bottom: var(--space-7);
		}
	}

	p {
		text-align: center;
		margin-bottom: var(--space-2);

		&:last-of-type {
			margin-bottom: var(--space-4);
		}
	}
</style>
