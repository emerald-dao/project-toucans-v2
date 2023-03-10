<script lang="ts">
	import { InputWrapper } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import SignatureElement from './atoms/signature-element/SignatureElement.svelte';
	import { validationSuite } from './validation';

	export let existingAddresses: string[];
	export let newAddresses: string[] = [];
	export let threshold: number = 1;
	export let allWalletsValid: boolean;
	export let thresholdValid: boolean;

	let walletsValidations: boolean[] = [];

	const addMultisig = () => {
		newAddresses = [...newAddresses, ''];
		walletsValidations = [...walletsValidations, false];
	};

	const deleteNewAddress = (i: number) => {
		newAddresses = newAddresses.filter((_, index) => index !== i);
		walletsValidations = walletsValidations.filter((_, index) => index !== i);
	};

	const deleteExistingAddress = (i: number) => {
		alert('Submit action to delete this signer');
	};

	const handleChange = () => {
		res = validationSuite(threshold, newAddresses.length + existingAddresses.length);
	};

	let res = validationSuite.get();

	$: allWalletsValid = walletsValidations.every((walletValid) => walletValid);
	$: thresholdValid = res.isValid() || !res.hasErrors();
</script>

<div class="main-wrapper">
	<div class="column-1">
		<span class="large">Threshold</span>
		<div class="threshold-wrapper">
			<InputWrapper
				name="threshold"
				errors={res.getErrors('threshold')}
				isValid={res.isValid('threshold')}
				required={true}
			>
				<input
					name="threshold"
					type="number"
					bind:value={threshold}
					on:input={handleChange}
					max={existingAddresses.length + newAddresses.length}
					min={1}
				/>
			</InputWrapper>
		</div>
	</div>
	<div class="column-1">
		<span class="large">Signers</span>
		{#each existingAddresses as multisigAddress, i}
			<SignatureElement
				owner={i === 0}
				{i}
				on:delete={() => deleteExistingAddress(i)}
				bind:address={multisigAddress}
			/>
		{/each}
		{#each newAddresses as address, i}
			<SignatureElement
				{i}
				on:delete={() => deleteNewAddress(i)}
				bind:address
				bind:walletValid={walletsValidations[i]}
				editable
			/>
		{/each}
		<div class="add-wallet-wrapper">
			<button on:click={addMultisig} class="header-link">
				<Icon icon="tabler:plus" />
				Add signer
			</button>
		</div>
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);

		span {
			max-width: 50ch;

			&.large {
				color: var(--clr-heading-main);
			}
		}

		.threshold-wrapper {
			width: 220px;
		}

		.add-wallet-wrapper {
			display: flex;
			justify-content: flex-start;

			.header-link {
				display: flex;
				align-items: center;
				gap: var(--space-2);
				font-size: var(--font-size-1);
				background-color: transparent;
				border: none;
			}
		}
	}
</style>
