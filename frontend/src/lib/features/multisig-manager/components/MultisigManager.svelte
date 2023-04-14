<script lang="ts">
	import { InputWrapper } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { thresholdSuite, walletsSuite } from '../validations/validation';
	import SignersListElement from './atoms/signers-list-element/SignersListElement.svelte';

	export let existingAddresses: string[];
	export let newAddresses: {
		address: string;
		id: string;
	}[] = [];
	export let threshold: number = 1;
	export let allWalletsValid: boolean;
	export let thresholdValid: boolean;

	const addNewAddress = () => {
		newAddresses = [
			...newAddresses,
			{
				address: '',
				id: newAddresses.length.toString()
			}
		];
		walletsRes = walletsSuite(newAddresses);
	};

	const deleteNewAddress = (i: number) => {
		newAddresses = newAddresses.filter((_, index) => index !== i);
		walletsRes = walletsSuite(newAddresses);
	};

	const onDeleteSigner = (i: number) => {
		alert('Submit action to delete this signer');
	};

	const handleThresholdChange = () => {
		thresholdRes = thresholdSuite(threshold, newAddresses.length + existingAddresses.length);
	};

	const handleWalletsChange = () => {
		walletsRes = walletsSuite(newAddresses);
	};

	let thresholdRes = thresholdSuite.get();
	let walletsRes = walletsSuite.get();

	$: allWalletsValid = walletsRes.isValid() || !walletsRes.hasErrors();
	$: thresholdValid = thresholdRes.isValid() || !thresholdRes.hasErrors();
</script>

<div class="main-wrapper">
	<div class="column-1">
		<span class="large">Threshold</span>
		<div class="threshold-wrapper">
			<InputWrapper
				name="threshold"
				errors={thresholdRes.getErrors('threshold')}
				isValid={thresholdRes.isValid('threshold')}
				required={true}
			>
				<input
					name="threshold"
					type="number"
					bind:value={threshold}
					on:input={handleThresholdChange}
					max={existingAddresses.length + newAddresses.length}
					min={1}
				/>
			</InputWrapper>
		</div>
	</div>
	<div class="column-1">
		<span class="large">Signers</span>
		{#each existingAddresses as multisigAddress, i}
			<SignersListElement
				owner={i === 0}
				{i}
				on:delete={() => onDeleteSigner(i)}
				bind:address={multisigAddress}
				bind:res={walletsRes}
			/>
		{/each}
		{#each newAddresses as field, i}
			<SignersListElement
				{i}
				on:delete={() => deleteNewAddress(i)}
				bind:address={field.address}
				bind:res={walletsRes}
				on:input={handleWalletsChange}
				editable
			/>
		{/each}
		<div class="add-wallet-wrapper">
			<button on:click={addNewAddress} class="header-link">
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
