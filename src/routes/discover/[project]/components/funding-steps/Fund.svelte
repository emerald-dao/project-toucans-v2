<script type="ts">
	import Icon from '@iconify/svelte';
	import { InputWrapper } from '@emerald-dao/component-library';
	import { Button } from '@emerald-dao/component-library';
	import { fundActiveStep } from '$stores/fund/FundSteps';
	import { Column, Row } from '@mateoroldos/svelte.bones';
	import { fundData } from '$stores/fund/FundDataStore';
	import fundingSuite from '$lib/validations/fundingSuite';
	import { Currencies } from '$lib/types/currencies.enum';
	import { RadioButtons } from '$atoms';
	import { fade } from 'svelte/transition';

	const handleChange = (input: Event) => {
		res = fundingSuite($fundData, input.target.name);
	};

	let res = fundingSuite.get();

	const currenciesRadioButtonsData = {
		name: 'currency',
		bindStore: fundData,
		bindValue: 'currency',
		options: [
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
		]
	};
</script>

<div in:fade={{ duration: 200 }}>
	<Column gap="small" align="flex-start">
		<h3 class="w-medium">Fund Emerald DAO</h3>
		<form id="fund-form" on:submit|preventDefault={fundActiveStep.increment} autocomplete="off">
			<RadioButtons data={currenciesRadioButtonsData} />
			<label for="receive">Funding amount</label>
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

			<label for="receive">You will receive</label>

			<input
				name="receive"
				type="text"
				value="${($fundData.amount * $fundData.issuanceRate).toFixed(2)} EMLD"
				readonly
				id="receive"
			/>
		</form>
		<Button form="fund-form" size="full-width" state={res.isValid() ? 'active' : 'disabled'}
			><Icon icon="tabler:pig-money" />Fund</Button
		>
	</Column>
</div>

<style type="scss">
	form {
		width: 100%;
		display: flex;
		flex-direction: column;

		.token-name {
			font-size: var(--fs-200);
			--font-weight: 600;
			color: var(--clr-font-text-t4);
		}

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
