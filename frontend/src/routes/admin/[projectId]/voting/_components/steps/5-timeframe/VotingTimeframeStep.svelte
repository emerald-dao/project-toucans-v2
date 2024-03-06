<script lang="ts">
	import { fly } from 'svelte/transition';
	import { votingGeneratorDates } from '../../../votingGeneratorData';
	import validationSuite from './validation';
	import { votingGeneratorGeneralData } from '../../../votingGeneratorData';
	import type { SuiteRunResult } from 'vest';

	export let isValid = false;

	const handleChange = () => {
		res = validationSuite(
			$votingGeneratorGeneralData.name,
			$votingGeneratorGeneralData.description
		);

		(res as SuiteRunResult).done(() => {
			isValid = res.isValid();
		});
	};

	let res = validationSuite.get();
</script>

<div class="column-5">
	<div class="column-3" transition:fly={{ y: 20, duration: 200 }}>
		<div class="column-1">
			<label for="start-date">Start date</label>
			<input
				type="datetime-local"
				name="start-date"
				id="start-date"
				min={new Date().toISOString().slice(0, new Date().toISOString().lastIndexOf(':'))}
				bind:value={$votingGeneratorDates.startDate}
				on:input={handleChange}
			/>
		</div>
		<div class="column-1">
			<label for="end-date">End date</label>
			<input
				type="datetime-local"
				name="end-date"
				id="end-date"
				min={$votingGeneratorDates.startDate}
				bind:value={$votingGeneratorDates.endDate}
				on:input={handleChange}
			/>
		</div>
	</div>
</div>

<style lang="scss">
	label {
		width: fit-content;
	}

	input[type='datetime-local'] {
		color: var(--clr-text-main);
	}

	input[type='datetime-local']::-webkit-calendar-picker-indicator {
		filter: invert(50%);
	}
</style>
