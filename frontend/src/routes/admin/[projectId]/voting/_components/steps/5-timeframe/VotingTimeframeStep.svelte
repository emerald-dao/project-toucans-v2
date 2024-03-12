<script lang="ts">
	import { fly } from 'svelte/transition';
	import validationSuite from './validation';
	import type { SuiteRunResult } from 'vest';
	import { onMount } from 'svelte';
	import { votingGeneratorDates } from '../../../_config/votingGeneratorData';

	export let isValid = false;

	let startNow = true;

	onMount(() => {
		handleChange();
	});

	$: startNow && ($votingGeneratorDates.startDate = undefined);

	const handleChange = () => {
		setTimeout(() => {
			res = validationSuite(
				$votingGeneratorDates.startDate,
				$votingGeneratorDates.endDate,
				startNow
			);

			(res as SuiteRunResult).done(() => {
				isValid = res.isValid();
			});
		}, 1);
	};

	$: endDateMin =
		$votingGeneratorDates.startDate ??
		new Date().toISOString().slice(0, new Date().toISOString().lastIndexOf(':'));

	let res = validationSuite.get();
</script>

<div class="column-5">
	<div class="column-5" in:fly={{ y: 20, duration: 200 }}>
		<div class="column-2">
			<label for="start-now" class="switch">
				<input
					type="checkbox"
					name="start-now"
					id="start-now"
					bind:checked={startNow}
					on:input={handleChange}
				/>
				<span class="slider" />
				Start Now
			</label>
			{#if !startNow}
				<div class="column-1" in:fly|locale={{ duration: 200, y: -20 }}>
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
						<p in:fly={{ duration: 200, y: 20 }} class="error">
							{res.tests['start-date'].errors[0]}
						</p>
					{/if}
				</div>
			{/if}
		</div>
		<div class="column-1">
			<label for="end-date">End date</label>
			<input
				type="datetime-local"
				name="end-date"
				id="end-date"
				min={endDateMin}
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
