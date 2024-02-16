<script lang="ts">
	import { fly } from 'svelte/transition';
	import { votingGeneratorDates } from '../../../votingGeneratorData';
</script>

<div class="column-5">
	<div class="column-3" transition:fly={{ y: 20, duration: 200 }}>
		<div class="column-1">
			<label for="start-date">Start date</label>
			<input type="datetime-local" name="start-date" bind:value={$votingGeneratorDates.startDate} />
		</div>
		<div class="column-1">
			<label for="end-date">End date</label>
			<input type="datetime-local" bind:value={$votingGeneratorDates.endDate} />
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
