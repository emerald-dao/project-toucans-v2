<script type="ts">
	import Icon from '@iconify/svelte';
	import { InputWrapper } from '@emerald-dao/component-library';
	import { Button } from '@emerald-dao/component-library';
	import { fundActiveStep } from '$stores/fund/FundSteps';
	import { fundData } from '$stores/fund/FundDataStore';
	import fundingSuite from '$lib/validations/fundingSuite';
	import { Currencies } from '$lib/types/currencies.enum';
	import { RadioButtons } from '$atoms';
	import { fade } from 'svelte/transition';

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = fundingSuite($fundData, target.name);
	};

	let res = fundingSuite.get();

	const currenciesOptions = [
		{
			name: Currencies.FLOW,
			value: Currencies.FLOW,
			text: '$FLOW'
		},
		{
			name: Currencies.FUSD,
			value: Currencies.FUSD,
			text: '$FUSD'
		}
	];
</script>

<div in:fade={{ duration: 200 }}>
	<div class="column-6 align-start">
		<h3 class="w-medium">Fund Emerald DAO</h3>
		<form id="fund-form" on:submit|preventDefault={fundActiveStep.increment} autocomplete="off">
			<label for="receive">Funding amount</label>
			<RadioButtons
				name="currencies"
				bind:binding={$fundData['currency']}
				options={currenciesOptions}
			/>
			<InputWrapper
				name="amount"
				iconUrl={$fundData.currency === Currencies.FLOW ? '/flow-logo.png' : '/fusd-logo.png'}
				errors={res.getErrors('amount')}
				isValid={res.isValid('amount')}
			>
				<input
					type="number"
					name="amount"
					placeholder="1000"
					bind:value={$fundData.amount}
					on:input={handleChange}
				/>
			</InputWrapper>
			<InputWrapper
				name="message"
				label="Add a special message"
				errors={res.getErrors('message')}
				isValid={res.isValid('message')}
			>
				<textarea
					name="message"
					placeholder="Write a special message"
					bind:value={$fundData.specialMessage}
					on:input={handleChange}
				/>
			</InputWrapper>
			{#if $fundData.issuanceRate}
				<label for="receive">You will receive</label>
				<input
					name="receive"
					type="text"
					value="${(($fundData.amount ? $fundData.amount : 0) * $fundData.issuanceRate).toFixed(
						2
					)} EMLD"
					readonly
					id="receive"
				/>
			{/if}
		</form>
		<Button form="fund-form" size="full-width" state={res.isValid() ? 'active' : 'disabled'}
			><Icon icon="tabler:pig-money" />Fund</Button
		>
	</div>
</div>

<style type="scss">
	form {
		width: 100%;
		display: flex;
		flex-direction: column;

		label {
			margin-bottom: var(--space-2);
		}

		#receive {
			padding: 0;
			background-color: transparent;
			border: none;
		}

		textarea {
			min-height: 8rem;
			min-width: 300px;
			max-width: 300px;
			margin-top: var(--space-2);
		}
	}
</style>
