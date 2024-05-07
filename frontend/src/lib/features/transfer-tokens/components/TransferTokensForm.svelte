<script type="ts">
	import CurrencyInput from '$components/atoms/CurrencyInput.svelte';
	import { slide } from 'svelte/transition';
	import { InputWrapper } from '@emerald-dao/component-library';
	import type { SuiteRunResult } from 'vest';
	import UserAvatar from '$components/atoms/user/UserAvatar.svelte';
	import transferValidation from '../validation/transferValidation';

	export let isValid: boolean = false;
	export let availableBalance: number;
	export let contractAddress: string | null;
	export let projectId: string | undefined;
	export let currencyToDistribute: string;
	export let amount = 0;
	export let address = '';

	let res = transferValidation.get();
	let addressPending: boolean;
	let addressPendingMessage = ['Checking if address has collection vault...'];

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = transferValidation(
			address,
			amount,
			target.name,
			availableBalance,
			contractAddress,
			projectId,
			currencyToDistribute
		);

		addressPending = true;

		(res as SuiteRunResult).done((result) => {
			res = result;
			addressPending = false;
			isValid = res.isValid();
		});
	};
</script>

<form id="transfer-form" autocomplete="off" class="wrapper">
	<div>
		<InputWrapper
			name="address"
			label="Recipient Address"
			pending={addressPending}
			pendingMessage={addressPendingMessage}
			errors={res.getErrors('address')}
			isValid={res.isValid('address')}
		>
			<input
				name="address"
				type="text"
				maxlength="18"
				bind:value={address}
				on:input={handleChange}
			/>
		</InputWrapper>
		{#if res.isValid('address') && address}
			<div transition:slide|local={{ duration: 400 }} class="avatar-wrapper">
				<UserAvatar {address} />
			</div>
		{/if}
	</div>
	<CurrencyInput
		name="amount"
		label="Amount"
		currency={currencyToDistribute}
		errors={res.getErrors('amount')}
		isValid={res.isValid('amount')}
		on:input={(input) => handleChange(input.detail)}
		bind:value={amount}
	/>
</form>

<style lang="scss">
	#transfer-form {
		display: flex;
		flex-direction: column;

		.avatar-wrapper {
			margin-top: -10px;
			margin-bottom: 10px;
		}
	}
</style>
