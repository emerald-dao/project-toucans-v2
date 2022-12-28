<script type="ts">
	import type { Writable } from 'svelte/store';

	interface Option {
		name: string;
		value: string;
		text: string;
	}

	interface RadiosData {
		name: string;
		bindStore: Writable;
		bindValue: string;
		options: Option[];
	}

	export let data: RadiosData;

	let { bindStore } = data;
</script>

<div>
	{#each data.options as option}
		<input
			type="radio"
			id={option.name}
			name={data.name}
			bind:group={$bindStore[data.bindValue]}
			value={option.value}
		/>
		<label for={option.name}>
			<span>{option.text}</span>
		</label>
	{/each}
</div>

<style type="scss">
	div {
		display: flex;
		flex-direction: row;
		margin-bottom: var(--space-4);

		input {
			display: none;
		}

		label {
			padding: 0.4rem 0.8rem;
			border: 2px var(--clr-border-primary) solid;
			cursor: pointer;
			font-size: var(--font-size-0);
			--font-weight: 400;
			transition: 0.4s;
		}

		label:not(:nth-child(2)) {
			margin-left: -2px;
		}

		label:nth-child(2) {
			border-radius: 0.6rem 0 0 0.6rem;
		}

		input:nth-last-child(2) + label {
			border-radius: 0 0.6rem 0.6rem 0;
		}

		input:checked + label {
			background-color: var(--clr-neutral-700);
		}
	}
</style>
