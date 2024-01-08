<script type="ts">
	import { fly } from 'svelte/transition';
	import { InputWrapper } from '@emerald-dao/component-library';
	import type { SuiteRunResult } from 'vest';
	import nftDistributionValidation from '../../_validations/nftDistributionValidation';
	import { onMount } from 'svelte';
	import UserAvatar from '$components/atoms/user/UserAvatar.svelte';

	export let address: string;
	export let collectionId: string;
	export let isValid: boolean = false;

	let res = nftDistributionValidation.get();
	let addressPending: boolean;
	let addressPendingMessage = ['Checking if address has collection vault...'];

	export const handleChange = () => {
		res = nftDistributionValidation(address, collectionId);

		addressPending = true;

		(res as SuiteRunResult).done((result) => {
			res = result;
			addressPending = false;
			handleValidation();
		});
	};

	const handleValidation = () => {
		if (!res.hasErrors('address') && res.getErrors('address').length === 0) {
			isValid = true;
		} else {
			isValid = false;
		}
	};

	onMount(() => {
		nftDistributionValidation.reset();
		res = nftDistributionValidation.get();
	});

	$: if (address === '') {
		nftDistributionValidation.reset();
		res = nftDistributionValidation.get();
	}
</script>

<div transition:fly|local={{ duration: 200, y: 30 }}>
	<form id="dist-form" autocomplete="off" class="wrapper">
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
	</form>
	{#if res.isValid() && address}
		<div in:fly|local={{ duration: 400, x: -5 }}>
			<UserAvatar {address} fontSize="var(--font-size-0)" />
		</div>
	{/if}
</div>

<style lang="scss">
	div {
		display: grid;
		gap: var(--space-4);
		grid-template-columns: 250px 1fr;
	}
</style>
