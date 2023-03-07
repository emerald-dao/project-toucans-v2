<script lang="ts">
	import { fly } from 'svelte/transition';
	import { daoGeneratorData } from './../../../../stores/DaoGeneratorData';
	import { InputWrapper } from '@emerald-dao/component-library';
	import { createEventDispatcher } from 'svelte';
	import Icon from '@iconify/svelte';
	import { create, enforce, test, only } from 'vest';

	const dispatch = createEventDispatcher();

	export let index: number;
	export let address: string;
	export let walletValid;

	const validationSuite = create((data = {}, currentField, index: number) => {
		only(currentField);

		test(`multisig-wallet-${index}`, 'Wallet address is needed', () => {
			enforce(data.addresses[index]).isNotEmpty();
		});

		test(`multisig-wallet-${index}`, 'Wallet address should be exactly 18 chars long', () => {
			enforce(data.addresses[index]).lengthEquals(18);
		});
	});

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = validationSuite($daoGeneratorData.multisig, target.name, index);
	};

	let res = validationSuite.get();

	$: walletValid = index > 0 ? res.isValid(`multisig-wallet-${index}`) : true;
</script>

<div class="main-wrapper row-3 align-center" in:fly|local={{ y: 10, duration: 400 }}>
	<div class="secondary-wrapper">
		<InputWrapper
			name={`multisig-wallet-${index}`}
			label={`Multisig wallet ${index + 1}`}
			errors={res.getErrors(`multisig-wallet-${index}`)}
			isValid={res.isValid(`multisig-wallet-${index}`)}
			required={true}
		>
			<input
				name={`multisig-wallet-${index}`}
				type="text"
				placeholder="0x1234567890abcdef"
				maxlength="18"
				disabled={index === 0}
				bind:value={address}
				on:input={handleChange}
			/>
		</InputWrapper>
	</div>
	{#if index > 0}
		<div class="trash-wrapper" on:click={() => dispatch('delete', index)} on:keydown>
			<Icon icon="tabler:trash" class="delete" />
		</div>
	{/if}
</div>

<style lang="scss">
	.main-wrapper {
		width: 100%;

		.secondary-wrapper {
			width: 100%;
		}

		.trash-wrapper {
			cursor: pointer;
		}
	}
</style>
