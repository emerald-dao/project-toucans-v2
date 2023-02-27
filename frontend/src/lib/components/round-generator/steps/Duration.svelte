<script type="ts">
	import { fly, fade } from 'svelte/transition';
	import { Currencies } from '$lib/types/currencies.enum';
	import { onMount } from 'svelte';
	import newRoundSuite from '$lib/validations/newRoundSuite';
	import { InputWrapper, Button, Range } from '@emerald-dao/component-library';
	import { newRoundActiveStep } from '$stores/rounds/RoundSteps';
	import { roundData } from '$stores/rounds/RoundData';
	import { user } from '$stores/flow/FlowStore';
	import Icon from '@iconify/svelte';
	import StepTitle from '../atoms/StepTitle.svelte';

	export let tokenSymbol: string;
	export let projectId: string | undefined;
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

<div class="main-wrapper" in:fade={{ duration: 300}}>
	<form autocomplete="off">
		<StepTitle title="Round duration" stepNumber={1}/>
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
			{#if !$roundData.infiniteDuration}
				<div transition:fly|local={{ y: 10, duration: 140 }}>
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
