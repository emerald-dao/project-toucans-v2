<script type="ts">
	import Icon from '@iconify/svelte';
	import { fly, fade } from 'svelte/transition';
	import validationSuite from './validation';
	import { InputWrapper, Button, Range } from '@emerald-dao/component-library';
	import StepTitle from '../../../components/atoms/StepTitle.svelte';
	import { ECurrencies } from '$lib/types/common/enums';
	import { roundGeneratorData } from '../../../stores/RoundGeneratorData';
	import { newRoundActiveStep } from '../../../stores/RoundGeneratorSteps';

	export let tokenSymbol: string;
	export let projectId: string;
	export let editDelay: string;

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = validationSuite($roundGeneratorData, target.name);
	};

	let res = validationSuite.get();
</script>

<div class="main-wrapper" in:fade={{ duration: 300 }}>
	<form autocomplete="off">
		<StepTitle title="Round conditions" stepNumber={2} />
		<div class="form-section-wrapper currency">
			<label for="currencies">Currency</label>
			<div class="radio-tabs" id="currencies">
				<label>
					$FLOW
					<input
						type="radio"
						id="flow"
						name="currency"
						value={ECurrencies.FLOW}
						bind:group={$roundGeneratorData.currency}
					/>
				</label>
				<label>
					$FUSD
					<input
						type="radio"
						id="fusd"
						name="currency"
						value={ECurrencies.FUSD}
						bind:group={$roundGeneratorData.currency}
					/>
				</label>
			</div>
		</div>
		<div class="form-section-wrapper funding-goal">
			<label for="funding-goal">Funding goal</label>
			<label for="infinite-goal" class="switch">
				<input
					type="checkbox"
					name="infinite-goal"
					id="infinite-goal"
					bind:checked={$roundGeneratorData.infiniteFundingGoal}
					on:change={handleChange}
				/>
				<span class="slider" />
				Infinite
			</label>
			{#if !$roundGeneratorData.infiniteFundingGoal}
				<div class="funding-goal-input-wrapper" transition:fly|local={{ y: 10, duration: 140 }}>
					<InputWrapper
						name="fundingGoal"
						iconUrl={$roundGeneratorData.currency === ECurrencies.FLOW
							? '/flow-logo.png'
							: '/fusd-logo.png'}
						errors={res.getErrors('fundingGoal')}
						isValid={res.isValid('fundingGoal')}
						disabled={$roundGeneratorData.infiniteFundingGoal}
					>
						<input
							type="text"
							name="fundingGoal"
							placeholder="1000"
							bind:value={$roundGeneratorData.fundingGoal}
							on:input={handleChange}
							disabled={$roundGeneratorData.infiniteFundingGoal}
						/>
					</InputWrapper>
				</div>
			{/if}
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
					placeholder={`e.g. 1 ${tokenSymbol} - 1 ${$roundGeneratorData.currency}`}
					bind:value={$roundGeneratorData.issuanceRate}
					on:input={handleChange}
				/>
			</InputWrapper>
			<div class="range-wrapper">
				<div class="row-2">
					<label for="reserveRate">Reserve rate </label>
				</div>
				<Range
					bind:value={$roundGeneratorData.reserveRate}
					suffix="%"
					id="reserveRate"
					--clr-surface-secondary="var(--clr-surface-primary)"
				/>
			</div>
		</div>
	</form>
	<div class="button-wrapper">
		<a href="#" class="header-link row-2 align-center" on:click={newRoundActiveStep.decrement}>
			<Icon icon="tabler:arrow-left" />
			Back
		</a>
		<Button
			on:click={newRoundActiveStep.increment}
			state={res.isValid() ? 'active' : 'disabled'}
			size="large"
		>
			Next
			<Icon icon="tabler:arrow-right" />
		</Button>
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;

		form {
			min-width: 500px;
			max-width: 600px;
			display: flex;
			flex-direction: column;
			gap: var(--space-2);

			.form-section-wrapper {
				display: flex;
				flex-direction: column;

				&.currency {
					margin-bottom: var(--space-3);
				}

				&.funding-goal {
					gap: var(--space-1);

					&:not(:has(.funding-goal-input-wrapper)) {
						margin-bottom: var(--space-4);
					}

					.switch {
						--font-weight: 400;
					}
				}

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

					label[for='reserveRate'] {
						margin-bottom: var(--space-1);
					}
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

		.button-wrapper {
			min-width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin-top: var(--space-3);
		}
	}
</style>
