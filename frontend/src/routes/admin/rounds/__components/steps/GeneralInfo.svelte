<script type="ts">
	import { Currencies } from '$lib/types/currencies.enum';
	import { onMount } from 'svelte';
	import newRoundSuite from '$lib/validations/newRoundSuite';
	import { InputWrapper, Button, Range } from '@emerald-dao/component-library';
	import { newRoundActiveStep } from '$stores/rounds/RoundSteps';
	import { roundData } from '$stores/rounds/RoundData';
	import { user } from '$stores/flow/FlowStore';

	export let tokenSymbol: string;
	export let projectId: string;
	export let editDelay: string;

	// TODO: Consider edit delay with start time

	// initial time is 5 minutes from now, plus edit delay (which is in seconds)
	let now = new Date(new Date().getTime() + 5 * 60000 + Number(editDelay));
	let nowString = now.toISOString().split('.')[0];
	let oneMonthForwardString = new Date(now.getTime() + 2629743000).toISOString().split('.')[0];

	roundData.set({
		startDate: nowString,
		endDate: oneMonthForwardString,
		fundingGoal: undefined,
		currency: Currencies.FLOW,
		infiniteFundingGoal: false,
		infiniteDuration: false,
		distributionList: [[$user.addr, 100]],
		reserveRate: undefined,
		issuanceRate: undefined,
		projectId
	});

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = newRoundSuite($roundData, target.name);
	};

	onMount(() => {
		startDateInput.min = nowString;
	});

	let startDateInput: HTMLInputElement;
	let endDateInput: HTMLInputElement;

	let res = newRoundSuite.get();

	$: if (endDateInput) {
		endDateInput.min = $roundData.startDate;
	}
	$: if (new Date($roundData.startDate) > new Date($roundData.endDate)) {
		$roundData.endDate = new Date(
			new Date($roundData.startDate).setMonth(new Date($roundData.startDate).getMonth() + 1)
		)
			.toISOString()
			.split('T')[0];
	}
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
					bind:checked={$roundData.infiniteDuration}
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
					>
						<input
							type="datetime-local"
							name="startDate"
							id="startDate"
							bind:this={startDateInput}
							bind:value={$roundData.startDate}
							on:input={handleChange}
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
						disabled={$roundData.infiniteDuration}
					>
						<input
							type="datetime-local"
							name="endDate"
							id="endDate"
							bind:this={endDateInput}
							bind:value={$roundData.endDate}
							on:input={handleChange}
							disabled={$roundData.infiniteDuration}
						/>
					</InputWrapper>
				</div>
			</div>
		</div>
		<div class="form-section-wrapper">
			<label for="currencies">Currency</label>
			<div class="radio-tabs" id="currencies">
				<label>
					$FLOW
					<input
						type="radio"
						id="flow"
						name="currency"
						value={Currencies.FLOW}
						bind:group={$roundData.currency}
					/>
				</label>
				<label>
					$FUSD
					<input
						type="radio"
						id="fusd"
						name="currency"
						value={Currencies.FUSD}
						bind:group={$roundData.currency}
					/>
				</label>
			</div>
			<span>Funding round goal</span>
			<label for="infinite-goal" class="switch">
				<input
					type="checkbox"
					name="infinite-goal"
					id="infinite-goal"
					bind:checked={$roundData.infiniteFundingGoal}
				/>
				<span class="slider" />
				Infinite
			</label>
			<InputWrapper
				name="fundingGoal"
				iconUrl={$roundData.currency === Currencies.FLOW ? '/flow-logo.png' : '/fusd-logo.png'}
				errors={res.getErrors('fundingGoal')}
				isValid={res.isValid('fundingGoal')}
				label="Amount"
				disabled={$roundData.infiniteFundingGoal}
			>
				<input
					type="text"
					name="fundingGoal"
					placeholder="1000"
					bind:value={$roundData.fundingGoal}
					on:input={handleChange}
					disabled={$roundData.infiniteFundingGoal}
				/>
			</InputWrapper>
		</div>
		<div class="form-section-wrapper">
			<InputWrapper
				name="issuanceRate"
				errors={res.getErrors('issuanceRate')}
				isValid={res.isValid('issuanceRate')}
				label="Issuance Rate"
			>
				<input
					type="text"
					name="issuanceRate"
					min="0"
					placeholder={`e.g. 1 ${tokenSymbol} - 1 ${$roundData.currency}`}
					bind:value={$roundData.issuanceRate}
					on:input={handleChange}
				/>
			</InputWrapper>
			<div class="range-wrapper">
				<div class="row-2">
					<label for="reserveRate">Reserve rate </label>
				</div>
				<Range bind:value={$roundData.reserveRate} suffix="%" id="reserveRate" />
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
		max-width: 600px;
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

			.range-wrapper {
				margin-bottom: var(--space-7);
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
