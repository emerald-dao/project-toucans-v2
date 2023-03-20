<script type="ts">
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import validationSuite from './validation';
	import { InputWrapper } from '@emerald-dao/component-library';
	import { user } from '$stores/flow/FlowStore';
	import { roundGeneratorData } from '$lib/features/round-generator/stores/RoundGeneratorData';
	import { ECurrencies } from '$lib/types/common/enums';
	import { toISOStringWithTimezone } from '$lib/utilities/formatDate';

	export let projectId: string | undefined;
	export let editDelay: string;
	export let isValid: boolean;

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

	$: isValid = res.isValid();

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

<form in:fade={{ duration: 300 }} autocomplete="off">
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

<style type="scss">
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
	}
</style>
