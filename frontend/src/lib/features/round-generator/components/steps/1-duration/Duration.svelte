<script type="ts">
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import validationSuite from './validation';
	import { InputWrapper, Button } from '@emerald-dao/component-library';
	import { user } from '$stores/flow/FlowStore';
	import Icon from '@iconify/svelte';
	import { roundGeneratorData } from '$lib/features/round-generator/stores/RoundGeneratorData';
	import { newRoundActiveStep } from '$lib/features/round-generator/stores/RoundGeneratorSteps';
	import { ECurrencies } from '$lib/types/common/enums';
	import StepTitle from '../../../components/atoms/StepTitle.svelte';
	import { toISOStringWithTimezone } from '$lib/utilities/formatDate';

	export let tokenSymbol: string;
	export let projectId: string | undefined;
	export let editDelay: string;

	// initial time is 5 minutes from now, plus edit delay (which is in seconds)
	let now = new Date(new Date().getTime() + 5 * 60000 + Number(editDelay));
	let localeISO = toISOStringWithTimezone(now);
	let nowString = localeISO.split('.')[0];
	let oneMonthForwardString = new Date(now.getTime() + 2629743000).toISOString().split('.')[0];

	if ($user.addr) {
		roundGeneratorData.set({
			startDate: nowString,
			endDate: oneMonthForwardString,
			fundingGoal: undefined,
			currency: ECurrencies.FLOW,
			infiniteFundingGoal: false,
			infiniteDuration: false,
			distributionList: [[$user.addr, 100]],
			reserveRate: undefined,
			issuanceRate: undefined,
			projectId
		});
	}

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = validationSuite($roundGeneratorData, target.name);
	};

	let res = validationSuite.get();

	onMount(() => {
		startDateInput.min = nowString;
	});

	let startDateInput: HTMLInputElement;
	let endDateInput: HTMLInputElement;

	$: if (endDateInput) {
		endDateInput.min = $roundGeneratorData.startDate;
	}
	$: if (new Date($roundGeneratorData.startDate) > new Date($roundGeneratorData.endDate)) {
		$roundGeneratorData.endDate = new Date(
			new Date($roundGeneratorData.startDate).setMonth(
				new Date($roundGeneratorData.startDate).getMonth() + 1
			)
		)
			.toISOString()
			.split('T')[0];
	}
</script>

<div class="main-wrapper" in:fade={{ duration: 300 }}>
	<form autocomplete="off">
		<StepTitle title="Round duration" stepNumber={1} />
		<label for="infinite-duration" class="switch">
			<input
				type="checkbox"
				name="infinite-duration"
				id="infinite-duration"
				bind:checked={$roundGeneratorData.infiniteDuration}
				on:change={handleChange}
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
						bind:value={$roundGeneratorData.startDate}
						on:input={handleChange}
					/>
				</InputWrapper>
			</div>
			{#if !$roundGeneratorData.infiniteDuration}
				<div transition:fly|local={{ y: 10, duration: 140 }}>
					<InputWrapper
						name="endDate"
						errors={res.getErrors('endDate')}
						isValid={res.isValid('endDate')}
						label="End date"
						statusIcons={false}
						disabled={$roundGeneratorData.infiniteDuration}
					>
						<input
							type="datetime-local"
							name="endDate"
							id="endDate"
							bind:this={endDateInput}
							bind:value={$roundGeneratorData.endDate}
							on:input={handleChange}
							disabled={$roundGeneratorData.infiniteDuration}
						/>
					</InputWrapper>
				</div>
			{/if}
		</div>
	</form>
	<div class="button-wrapper">
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
			display: flex;
			flex-direction: column;
			gap: var(--space-2);

			span {
				font-size: var(--font-size-1);
			}

			.date-inputs-wrapper {
				margin-top: var(--space-5);
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

		.button-wrapper {
			min-width: 100%;
			display: flex;
			justify-content: flex-end;
			margin-top: var(--space-3);
		}
	}
</style>
