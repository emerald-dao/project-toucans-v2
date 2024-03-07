<script lang="ts">
	import { fly } from 'svelte/transition';
	import { votingGeneratorDates } from '../../../votingGeneratorData';
	import validationSuite from './validation';
	import type { SuiteRunResult } from 'vest';

	export let isValid = false;

	const handleChange = () => {
		res = validationSuite($votingGeneratorDates.startDate, $votingGeneratorDates.endDate);

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
			{#if res.tests['start-date'] && res.tests['start-date'].errors.length > 0}
				<p in:fly={{ duration: 200, y: 20 }} class="error">{res.tests['start-date'].errors[0]}</p>
			{/if}
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
			{#if res.tests['end-date'] && res.tests['end-date'].errors.length > 0}
				<p in:fly={{ duration: 200, y: 20 }} class="error">{res.tests['end-date'].errors[0]}</p>
			{/if}
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

	.error {
		color: var(--clr-alert-main);
		font-size: var(--font-size-1);
	}
</style>
