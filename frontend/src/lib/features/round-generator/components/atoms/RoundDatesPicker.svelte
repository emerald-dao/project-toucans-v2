<script lang="ts">
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';
	import type flatpickr from 'flatpickr';
	import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';

	export let rounds: FundingCycle[];
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

<div>
	<Flatpickr {options} bind:value bind:formattedValue on:change={handleChange} name="date" />
</div>

<style lang="scss">
	div {
		background-color: var(--clr-surface-primary);
		width: fit-content;
		padding: var(--space-6);
		border-radius: var(--radius-6);
	}

	:global(.flatpickr-input) {
		display: none;
	}

	:global(.flatpickr-calendar) {
		background-color: transparent;
		box-shadow: none;
	}

	:global(.flatpickr-day) {
		color: var(--clr-text-main);
	}

	:global(.flatpickr-day:hover, .flatpickr-day:hover .nextMonthDay) {
		background-color: var(--clr-primary-badge) !important;
		border-color: transparent !important;
	}

	:global(.flatpickr-day.endRange, .flatpickr-day.startRange) {
		background-color: var(--clr-primary-main) !important;
		border-color: var(--clr-primary-main) !important;
		color: var(--clr-heading-inverse) !important;
	}

	:global(
			.flatpickr-day.endRange.startRange + .endRange:not(:nth-child(7n + 1)),
			.flatpickr-day.selected.startRange + .endRange:not(:nth-child(7n + 1)),
			.flatpickr-day.startRange.startRange + .endRange:not(:nth-child(7n + 1))
		) {
		box-shadow: -5px 0 0 var(--clr-primary-badge) !important;
	}

	:global(.flatpickr-day.selected, ) {
		background: var(--clr-primary-main);
		border-color: var(--clr-primary-main);
		color: var(--clr-heading-inverse);
	}

	:global(.inRange) {
		background-color: var(--clr-primary-badge) !important;
		border: none;
		box-shadow: 5px 0 0 var(--clr-primary-badge) !important;
	}

	:global(.startRange) {
		box-shadow: 5px 0 0 var(--clr-primary-badge) !important;
	}

	:global(.flatpickr-day.today) {
		border-color: var(--clr-border-primary);
	}

	:global(.flatpickr-day.flatpickr-disabled, .flatpickr-day.flatpickr-disabled:hover) {
		color: var(--clr-alert-off) !important;
		background-color: transparent !important;
		opacity: 0.5;
	}

	:global(.flatpickr-day.prevMonthDay),
	:global(.flatpickr-day.nextMonthDay) {
		color: var(--clr-text-off);
	}

	:global(.flatpickr-weekday) {
		color: var(--clr-text-main) !important;
	}

	:global([class^='flatpickr']) {
		color: var(--clr-text-main);
	}

	:global(
			.flatpickr-months .flatpickr-next-month svg,
			.flatpickr-months .flatpickr-prev-month svg
		) {
		fill: var(--clr-text-main);
	}

	:global(
			.flatpickr-months .flatpickr-next-month:hover svg,
			.flatpickr-months .flatpickr-prev-month:hover svg
		) {
		fill: var(--clr-heading-main) !important;
	}

	:global(.flatpickr-calendar.hasTime .flatpickr-time) {
		border-top: 1px var(--clr-neutral-badge) solid;
		margin-top: var(--space-4);
	}

	:global(
			.numInputWrapper:hover,
			.numInput:hover,
			.numInput:focus,
			.flatpickr-am-pm:hover,
			.flatpickr-am-pm:focus,
			.flatpickr-am-pm,
			.flatpickr-time-separator
		) {
		background: none !important;
		color: var(--clr-text-main) !important;
	}

	:global([class^='flatpickr'] .numInput, ) {
		color: var(--clr-text-main);
	}

	:global(.flatpickr-weekdays) {
		margin-block: var(--space-4) var(--space-2);
		padding-top: var(--space-3);
		border-top: 1px var(--clr-neutral-badge) solid;
	}
</style>
