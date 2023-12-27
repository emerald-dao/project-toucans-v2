<script type="ts">
	import { fly } from 'svelte/transition';
	import { InputWrapper } from '@emerald-dao/component-library';
	import type { SuiteRunResult } from 'vest';
	import nftsValidationSuite from './validateNFTs';

	export let address: string;
	export let projectOwner: string;
	export let projectId: string;
	export let nftInputsAreValid: boolean = false;

	let res = nftsValidationSuite.get();
	let addressPending: boolean;
	let addressPendingMessage = ['Checking if address exists in the blockchain'];

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = nftsValidationSuite(address, target.name, projectOwner, projectId);

		if (target.name === 'address') {
			addressPending = true;
		}

		(res as SuiteRunResult).done((result) => {
			res = result;
			addressPending = false;
			handleValidation();
		});
	};

	const handleValidation = () => {
		if (!res.hasErrors('address') && res.getErrors('address').length === 0) {
			nftInputsAreValid = true;
		} else {
			nftInputsAreValid = false;
		}
	};
</script>

<div transition:fly|local={{ duration: 200, y: 30 }}>
	<form id="dist-form" autocomplete="off" class="wrapper">
		<InputWrapper
			name="address"
			label="Address"
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
</div>
