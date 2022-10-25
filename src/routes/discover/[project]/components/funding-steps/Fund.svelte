<script type="ts">
	import Icon from '@iconify/svelte';
	import InputWrapper from '$lib/components/forms/InputWrapper.svelte';
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
		<h4>Fund Emerald DAO</h4>
		<form id="fund-form" on:submit|preventDefault={fundActiveStep.increment} autocomplete="off">
			<label for="amount">Amount to Found</label>
			<Column gap={0.2} align="flex-start">
				<RadioButtons data={currenciesRadioButtonsData} />
				<InputWrapper
					name="amount"
					iconUrl={$fundData.currency === Currencies.FLOW ? '/flow-logo.png' : '/fusd-logo.png'}
					{res}
				>
					<input
						type="number"
						name="amount"
						placeholder="1000"
						bind:value={$fundData.amount}
						on:input={handleChange}
					/>
				</InputWrapper>
			</Column>
			<InputWrapper name="message" label="Add a special message" {res}>
				<textarea
					name="message"
					placeholder="Write a special message"
					bind:value={$fundData.specialMessage}
					on:input={handleChange}
				/>
			</InputWrapper>

			<label for="recieve">You will recieve</label>
			<Row gap={0.1}>
				<span class="token-name">${'EMLD'}</span>
				<input
					name="recieve"
					type="text"
					value={($fundData.amount * $fundData.issuanceRate).toFixed(2)}
					readonly
					id="recieve"
				/>
			</Row>
		</form>
		<Button form="fund-form" size="full-width" state={res.isValid() ? 'active' : 'disabled'}
			><Icon icon="tabler:pig-money" />Fund</Button
		>
	</Column>
</div>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;

		.token-name {
			font-size: var(--fs-200);
			--font-weight: 600;
			color: var(--clr-font-text-t4);
		}

		#recieve {
			background-color: transparent;
			border: none;
		}

		textarea {
			min-height: 8rem;
		}
	}
</style>
