<script type="ts">
	import { Currencies } from '$lib/types/currencies.enum';
	import { onMount } from 'svelte';
	import newRoundSuite from '$lib/validations/newRoundSuite';
	import { InputWrapper, Button } from '@emerald-dao/component-library';
	import { newRoundActiveStep } from '$stores/rounds/RoundSteps';

	let now = new Date();
	let nowString = now.toISOString().split('T')[0];
	let oneMonthForwardSting = new Date(new Date().setMonth(new Date().getMonth() + 1))
		.toISOString()
		.split('T')[0];

	let infiniteDuration = false;
	let infiniteFundingGoal = false;

	let formData: FormData = {
		startDate: nowString,
		endDate: oneMonthForwardSting,
		fundingGoal: 0,
		currency: Currencies.FLOW
	};
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
	interface FormData {
		startDate: string;
		endDate: string;
		fundingGoal: number;
		currency: Currencies;
	}

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = newRoundSuite(formData, target.name);
	};

	onMount(() => {
		startDateInput.min = nowString;
	});

	let startDateInput: HTMLInputElement;
	let endDateInput: HTMLInputElement;

	let res = newRoundSuite.get();

	$: if (endDateInput) endDateInput.min = formData.startDate;
	$: if (new Date(formData.startDate) > new Date(formData.endDate))
		formData.endDate = new Date(
			new Date(formData.startDate).setMonth(new Date(formData.startDate).getMonth() + 1)
		)
			.toISOString()
			.split('T')[0];
</script>

<div class="column-6">
	<span>General Info</span>
	<form autocomplete="off">
		<div class="form-section-wrapper">
			<span>Funding round duration</span>
			<label for="infinite-duration" class="switch">
				<input
					type="checkbox"
					name="infinite-duration"
					id="infinite-duration"
					bind:checked={infiniteDuration}
				/>
				<span class="slider" />
				Infinite
			</label>
			<div class="date-inputs-wrapper">
				<div>
					<InputWrapper
						name="startDate"
						errors={res.getErrors('startDate')}
						isValid={res.isValid('startDate')}
						label="Start date"
						statusIcons={false}
						disabled={infiniteDuration}
					>
						<input
							type="date"
							name="startDate"
							id="startDate"
							bind:this={startDateInput}
							bind:value={formData.startDate}
							on:input={handleChange}
							disabled={infiniteDuration}
						/>
					</InputWrapper>
				</div>
				<div>
					<InputWrapper
						name="endDate"
						errors={res.getErrors('endDate')}
						isValid={res.isValid('endDate')}
						label="End date"
						statusIcons={false}
						disabled={infiniteDuration}
					>
						<input
							type="date"
							name="endDate"
							id="endDate"
							bind:this={endDateInput}
							bind:value={formData.endDate}
							on:input={handleChange}
							disabled={infiniteDuration}
						/>
					</InputWrapper>
				</div>
			</div>
		</div>
		<div class="form-section-wrapper">
			<span>Funding round goal</span>
			<label for="infinite-goal" class="switch">
				<input
					type="checkbox"
					name="infinite-goal"
					id="infinite-goal"
					bind:checked={infiniteFundingGoal}
				/>
				<span class="slider" />
				Infinite
			</label>

			<div>
				<label for="currencies" class:disabled={infiniteFundingGoal}>Currency</label>
				<div class="radio-tabs" id="currencies">
					<label class:disabled={infiniteFundingGoal}>
						$FLOW
						<input
							type="radio"
							id="flow"
							name="currency"
							value={Currencies.FLOW}
							bind:group={formData['currency']}
						/>
					</label>
					<label class:disabled={infiniteFundingGoal}>
						$FUSD
						<input
							type="radio"
							id="fusd"
							name="currency"
							value={Currencies.FUSD}
							bind:group={formData['currency']}
						/>
					</label>
				</div>
				<InputWrapper
					name="fundingGoal"
					iconUrl={formData.currency === Currencies.FLOW ? '/flow-logo.png' : '/fusd-logo.png'}
					errors={res.getErrors('fundingGoal')}
					isValid={res.isValid('fundingGoal')}
					label="Amount"
					disabled={infiniteFundingGoal}
				>
					<input
						type="text"
						name="fundingGoal"
						placeholder="1000"
						bind:value={formData.fundingGoal}
						on:input={handleChange}
						disabled={infiniteFundingGoal}
					/>
				</InputWrapper>
			</div>
		</div>
		<div class="button-wrapper">
			<Button
				on:click={newRoundActiveStep.increment}
				width="extended"
				state={res.isValid() ? 'active' : 'disabled'}>Next</Button
			>
		</div>
	</form>
</div>

<style type="scss">
	form {
		max-width: 400px;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);

		.form-section-wrapper {
			display: flex;
			flex-direction: column;
			gap: var(--space-2);

			span {
				font-size: var(--font-size-1);
			}

			.date-inputs-wrapper {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: var(--space-4);
			}

			.radio-tabs {
				margin-bottom: var(--space-2);

				label {
					font-size: var(--font-size-0);
				}

				label:has(input:checked) {
					background-color: var(--clr-neutral-badge);
				}

				label.disabled {
					background-color: transparent !important;
					color: var(--clr-text-off) !important;
				}
			}
		}
	}

	span {
		color: var(--clr-heading-main);
	}

	.button-wrapper {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		margin-top: var(--space-3);
	}
</style>
