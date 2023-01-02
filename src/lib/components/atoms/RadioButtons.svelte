<script type="ts">
	export let options: Option[];
	export let name: string;
	export let binding: string;

	interface Option {
		name: string;
		value: string;
		text: string;
	}
</script>

<div>
	{#each options as option}
		<input type="radio" id={option.name} {name} bind:group={binding} value={option.value} />
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
			transition: 0.4s;
			color: var(--clr-heading-off);
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
			color: var(--clr-heading-main);
		}
	}
</style>
