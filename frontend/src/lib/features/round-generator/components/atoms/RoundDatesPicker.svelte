<script lang="ts">
	import Flatpickr from 'svelte-flatpickr';
	import type flatpickr from 'flatpickr';
	import 'flatpickr/dist/flatpickr.css';
	import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';

	export let rounds: FundingCycle[];
	export let startDate: string;
	export let endDate: string;
	export let infiniteDuration: boolean;

	const fundingRoundsDates = rounds
		.filter((round) => round.details.timeframe.startTime && round.details.timeframe.endTime)
		.map((round) => {
			return {
				from: Number(round.details.timeframe.startTime) * 1000,
				to: Number(round.details.timeframe.endTime) * 1000
			};
		});

	let value: Date;
	let formattedValue: string;

	const options = {
		mode: !infiniteDuration ? ('range' as 'range') : ('single' as 'single'),
		enableTime: true,
		inline: true,
		minDate: 'today',
		disable: fundingRoundsDates
	};

	const handleChange = (event: CustomEvent<[Date[], string, flatpickr.Instance]>) => {
		const [selectedDates] = event.detail;

		startDate = selectedDates[0].toISOString().split('.')[0];

		if (selectedDates[1]) {
			endDate = selectedDates[1].toISOString().split('.')[0];
		}
	};

	$: if (infiniteDuration) {
		options.mode = 'single';
		endDate = '';
		value = new Date();
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

	:global(.selected, .flatpickr-day.endRange, .flatpickr-day.startRange) {
		background-color: var(--clr-primary-600) !important;
		border-color: var(--clr-primary-600) !important;
		color: var(--clr-heading-inverse) !important;
	}

	:global(
			.flatpickr-day.endRange.startRange + .endRange:not(:nth-child(7n + 1)),
			.flatpickr-day.selected.startRange + .endRange:not(:nth-child(7n + 1)),
			.flatpickr-day.startRange.startRange + .endRange:not(:nth-child(7n + 1))
		) {
		box-shadow: -5px 0 0 var(--clr-primary-badge) !important;
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
