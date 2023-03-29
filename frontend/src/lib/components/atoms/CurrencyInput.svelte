<script type="ts">
	import { InputWrapper } from '@emerald-dao/component-library';
	import type { Suite } from 'vest';
	import { onMount } from 'svelte';

	export let validationSuite: Suite<
		(data: any, currentField: any, maxAmount: number | undefined) => void
	>;
	export let value: number | undefined;
	export let autofocus = false;
	export let isValid: boolean;
	export let currency: 'FUSD' | 'FLOW' | string;
	export let name = 'amount';
	export let maxAmount: number | undefined = undefined;

	if (!value) {
		value = 0;
	}

	let amountInput: HTMLInputElement;
	let amountValue: string;

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		// Workaround to make input element be displayed with commas
		let numericStringAmount = amountValue.toString().replace(/[^0-9]/g, '');
		let numberAmount = Number(numericStringAmount);
		let formattedValue = Intl.NumberFormat('en-US').format(numberAmount);

		value = numberAmount;
		amountInput.value = formattedValue;

		res = validationSuite(
			{
				[name]: value
			},
			target.name,
			maxAmount
		);
	};

	onMount(() => {
		if (autofocus) {
			amountInput.focus();
		}
	});

	let res = validationSuite.get();

	$: isValid = res.isValid();
</script>

<InputWrapper {name} isValid={res.isValid('amount')}>
	<div class="row align-center">
		<span class="currency-prefix large">
			{`$${currency}`}
		</span>
		<input
			type="text"
			{name}
			placeholder="0.00"
			bind:value={amountValue}
			bind:this={amountInput}
			on:input={handleChange}
		/>
	</div>
</InputWrapper>

<style type="scss">
	.currency-prefix {
		color: var(--clr-text-off);
	}

	input[name='amount'] {
		border: none;
		font-size: var(--font-size-7);
		color: var(--clr-heading-main);
		padding-block: 0;
	}
</style>
