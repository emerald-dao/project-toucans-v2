<script lang="ts">
	import { fly } from 'svelte/transition';
	import { votingGeneratorDates } from '../../../votingGeneratorData';

	let startDate: string;
	let endDate: string;

	$: if (startDate) {
		$votingGeneratorDates.startDate = new Date(startDate);
	}

	$: if (endDate) {
		$votingGeneratorDates.endDate = new Date(endDate);
	}
</script>

<div class="column-5">
	<label for="has-timeframe" class="switch">
		<input
			type="checkbox"
			name="has-timeframe"
			id="has-timeframe"
			bind:checked={$votingGeneratorDates.hasTimeframe}
		/>
		<span class="slider" />
		Voting has timeframe
	</label>
	{#if $votingGeneratorDates.hasTimeframe}
		<div class="column-3" transition:fly={{ y: 20, duration: 200 }}>
			<div class="column-1">
				<label for="start-date">Start date</label>
				<input type="datetime-local" name="start-date" bind:value={startDate} />
			</div>
			<div class="column-1">
				<label for="end-date">End date</label>
				<input type="datetime-local" bind:value={endDate} />
			</div>
		</div>
	{/if}
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
