<script type="ts">
	import { fly, fade } from 'svelte/transition';
	import validationSuite from './validation';
	import { InputWrapper, Range } from '@emerald-dao/component-library';
	import { ECurrencies } from '$lib/types/common/enums';
	import { roundGeneratorData } from '../../../stores/RoundGeneratorData';

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
						: '/usdc-logo.png'}
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
