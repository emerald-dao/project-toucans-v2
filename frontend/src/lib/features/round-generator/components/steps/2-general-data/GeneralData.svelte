<script type="ts">
	import { fly, fade } from 'svelte/transition';
	import validationSuite from './validation';
	import { InputWrapper, Range, TooltipIcon } from '@emerald-dao/component-library';
	import { ECurrencies } from '$lib/types/common/enums';
	import { roundGeneratorData } from '../../../stores/RoundGeneratorData';
	import { currencies } from '$stores/flow/TokenStore';

	export let tokenSymbol: string;
	export let isValid: boolean;

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = validationSuite($roundGeneratorData, target.name);
	};

	let res = validationSuite.get();

	$: isValid = res.isValid();
</script>

<form autocomplete="off" in:fade={{ duration: 300 }}>
	<div class="form-section-wrapper funding-goal">
		<label for="funding-goal">Funding Goal</label>
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
					iconUrl={currencies[$roundGeneratorData.currency].image}
					errors={res.getErrors('fundingGoal')}
					isValid={res.isValid('fundingGoal')}
					disabled={$roundGeneratorData.infiniteFundingGoal}
				>
					<input
						type="number"
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
			tooltip={`Amount of ${tokenSymbol} per 1 ${$roundGeneratorData.currency}`}
		>
			<input
				type="number"
				name="issuanceRate"
				min="0"
				placeholder={`e.g. 1 ${tokenSymbol} - 1 ${$roundGeneratorData.currency}`}
				bind:value={$roundGeneratorData.issuanceRate}
				on:input={handleChange}
			/>
		</InputWrapper>
		<div class="range-wrapper">
			<div class="row-2">
				<label for="reserveRate">Reserve Rate</label>
			</div>
			<Range
				bind:value={$roundGeneratorData.reserveRate}
				suffix="%"
				id="reserveRate"
				--clr-surface-secondary="var(--clr-surface-primary)"
			/>
		</div>
	</div>
	{#if !$roundGeneratorData.infiniteFundingGoal}
		<label for="allow-overflow" class="switch">
			<input
				type="checkbox"
				name="allow-overflow"
				id="allow-overflow"
				bind:checked={$roundGeneratorData.allowOverflow}
				on:change={handleChange}
			/>
			<span class="slider" />
			Allow overflow
			<TooltipIcon
				tooltip="If checked, the round will continue to accept contributions even if the funding goal is reached."
			/>
		</label>
	{/if}
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);

		.form-section-wrapper {
			display: flex;
			flex-direction: column;

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

			.range-wrapper {
				margin-bottom: var(--space-7);

				label[for='reserveRate'] {
					margin-bottom: var(--space-1);
				}
			}
		}
	}
</style>
