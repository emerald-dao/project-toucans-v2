<script lang="ts">
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';
	import type flatpickr from 'flatpickr';
	import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';

	export let rounds: FundingCycle[]; // we receive all the rounds so we can block selected dates
	export let startDate: string;
	export let endDate: string;
	export let infiniteDuration: boolean;
	export let minStartTimePlus5Minutes: Date;

	const fundingRoundsDates = rounds
		.filter((round) => round.details.timeframe.startTime && round.details.timeframe.endTime)
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

		if (selectedDates[0]) {
			startDate = (selectedDates[0].getTime() / 1000).toString();
		}

		if (selectedDates[1]) {
			endDate = (selectedDates[1].getTime() / 1000).toString();
		}
	};

	$: if (infiniteDuration) {
		options.mode = 'single';
		endDate = '';

		if (value) {
			if (Array.isArray(value) && value[0]) {
				startDate = (value[0].getTime() / 1000).toString();
				value = value[0];
			} else if (!Array.isArray(value)) {
				startDate = (value.getTime() / 1000).toString();
			}
		} else {
			value = minStartTimePlus5Minutes;
		}
	} else {
		options.mode = 'range';
	}
</script>

<div class="flatpickr-wrapper">
	<Flatpickr {options} bind:value bind:formattedValue on:change={handleChange} name="date" />
</div>
