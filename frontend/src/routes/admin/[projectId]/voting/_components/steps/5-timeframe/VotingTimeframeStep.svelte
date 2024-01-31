<script lang="ts">
	import { fly } from 'svelte/transition';
	import { votingGeneratorDates } from '../data';

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
		Show finished
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
