<script lang="ts">
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';
	import type flatpickr from 'flatpickr';
	import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';
	import { onMount } from 'svelte';

	export let rounds: FundingCycle[]; // we receive all the rounds so we can block selected dates
	export let startDate: string;
	export let endDate: string;
	export let initialStartDate: string;
	export let initialEndDate: string;
	export let infiniteDuration: boolean;
	export let minStartTimePlus5Minutes: Date;
	export let cycleId: string;

	let roundStarted: boolean; // if the round has already started, we can't change the start date

	const fundingRoundsDates = rounds
		.filter(
			(round, i) =>
				round.details.timeframe.startTime &&
				round.details.timeframe.endTime &&
				round.details.cycleId !== cycleId
		)
		.map((round) => {
			return {
				from: Number(round.details.timeframe.startTime) * 1000,
				to: Number(round.details.timeframe.endTime) * 1000
			};
		});

	let value: Date | Date[];
	let formattedValue: string;

	const options = {
		mode: !infiniteDuration ? ('range' as 'range') : ('single' as 'single'),
		enableTime: true,
		inline: true,
		minDate: minStartTimePlus5Minutes,
		disable: fundingRoundsDates
	};

	const handleChange = (event: CustomEvent<[Date[], string, flatpickr.Instance]>) => {
		const [selectedDates] = event.detail;

		if (selectedDates[0] && selectedDates[1]) {
			startDate = (selectedDates[0].getTime() / 1000).toString();
			endDate = (selectedDates[1].getTime() / 1000).toString();
		} else if (selectedDates[0] && !roundStarted) {
			startDate = (selectedDates[0].getTime() / 1000).toString();
		} else if (selectedDates[0] && roundStarted) {
			endDate = (selectedDates[0].getTime() / 1000).toString();
		}
	};

	onMount(() => {
		roundStarted = new Date(Number(initialStartDate) * 1000) < new Date();

		if (infiniteDuration && !roundStarted) {
			value = new Date(Number(initialStartDate) * 1000);
		} else if (endDate && !roundStarted) {
			value = [new Date(Number(initialStartDate) * 1000), new Date(Number(initialEndDate) * 1000)];
		} else if (roundStarted) {
			value = new Date(Number(initialEndDate) * 1000);
		}
	});

	$: if (endDate === '0' && !infiniteDuration) {
		endDate = initialEndDate;
	}

	$: if (infiniteDuration || endDate === '0') {
		if (roundStarted) {
			options.mode = 'single';
			startDate = initialStartDate;
		} else {
			options.mode = 'single';
			endDate = '0';

			if (infiniteDuration && value) {
				if (Array.isArray(value) && value[0]) {
					startDate = (value[0].getTime() / 1000).toString();
					value = value[0];
				} else if (!Array.isArray(value)) {
					startDate = (value.getTime() / 1000).toString();
				}
			} else {
				value = minStartTimePlus5Minutes;
			}
		}
	} else if (roundStarted) {
		options.mode = 'single';

		startDate = initialStartDate;
	} else {
		options.mode = 'range';
	}
</script>

<label for="flatpickr-wrapper">
	{#if roundStarted}
		Edit the end date of your round
	{:else}
		Edit the date of your round
	{/if}
</label>
<slot />
<div class="flatpickr-wrapper" class:off={roundStarted && infiniteDuration}>
	<Flatpickr {options} bind:value bind:formattedValue on:change={handleChange} name="date" />
</div>

<style lang="scss">
	.off {
		opacity: 0.5;
		pointer-events: none;
	}
</style>
