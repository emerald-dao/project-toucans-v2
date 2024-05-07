<script type="ts">
	import { InputWrapper } from '@emerald-dao/component-library';
	import { createEventDispatcher, onMount } from 'svelte';

	export let value: number | undefined;
	export let autofocus = false;
	export let isValid: boolean;
	export let label: string | undefined = undefined;
	export let currency: 'USDC' | 'FLOW' | string;
	export let name = 'amount';
	export let hasBorder = true;
	export let fontSize: string | undefined = undefined;
	export let fontColor: string | undefined = undefined;
	export let errors: string[] = [];
	export let tooltip: string | undefined = undefined;

	const dispatch = createEventDispatcher();

	let amountInput: HTMLInputElement;
	let amountValue: string;

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;
		let inputValue = target.value;

		if (inputValue && inputValue[inputValue.length - 1].match(/[^0-9.]/)) {
			inputValue = inputValue.slice(0, -1);
		}

		const [integer, decimal] = inputValue.split('.');
		const integerWithCommas = integer.replace(/,/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

		let pointClicked = inputValue[inputValue.length - 1] === '.';

		amountValue = decimal || pointClicked ? `${integerWithCommas}.${decimal}` : integerWithCommas;
		amountInput.value = amountValue;

		value = Number(amountValue.replace(/,/g, ''));

		dispatch('input', input);
	};

	const formatNumber = (number: number) => {
		const [integer, decimal] = number.toString().split('.');
		const integerWithCommas = integer.replace(/,/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

		return decimal ? `${integerWithCommas}.${decimal}` : integerWithCommas;
	};

	onMount(() => {
		if (value) {
			amountValue = formatNumber(value);
		}

		if (autofocus) {
			amountInput.focus();
		}
	});
</script>

<InputWrapper {name} {isValid} {errors} {label} {hasBorder} iconText={`$${currency}`} {tooltip}>
	<input
		type="text"
		{name}
		bind:value={amountValue}
		bind:this={amountInput}
		on:input={handleChange}
		placeholder="0.00"
		style={`font-size: ${fontSize}; color: ${fontColor}`}
	/>
</InputWrapper>
