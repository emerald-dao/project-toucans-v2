<script lang="ts">
	import { InputWrapper, TooltipIcon } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { thresholdSuite, walletsSuite } from '../validations/validation';
	import SignersListElement from './atoms/signers-list-element/SignersListElement.svelte';
	import type { SuiteRunResult } from 'vest';
	import { v4 as uuidv4 } from 'uuid';
	import GLOSSARY from '$lib/config/glossary';
	import { updateMultisigExecution } from '$flow/actions';

	export let existingAddresses: string[];
	export let newAddresses: {
		address: string;
		id: string;
	}[] = [];
	export let threshold: number = 1;
	export let allWalletsValid: boolean;
	export let thresholdValid: boolean;
	export let owner: string;
	export let projectId: string;

	const addNewAddress = () => {
		const walletId = uuidv4();

		newAddresses = [
			...newAddresses,
			{
				address: '',
				id: walletId
			}
		];
		walletsRes = walletsSuite(newAddresses, walletId, existingAddresses);
	};

	const deleteNewAddress = (id: string) => {
		newAddresses = newAddresses.filter((addr) => addr.id !== id);
		walletsRes = walletsSuite(newAddresses, id, existingAddresses);
	};

	const onDeleteSigner = async (newAddresses: string[]) => {
		await updateMultisigExecution(owner, projectId, newAddresses, threshold);
	};

	const handleThresholdChange = () => {
		thresholdRes = thresholdSuite(threshold, newAddresses.length + existingAddresses.length);
	};

	const handleWalletsChange = (input: Event, id: string) => {
		const target = input.target as HTMLInputElement;

		if (target.name === id) {
			walletValidationPending = true;
		}

		walletsRes = walletsSuite(newAddresses, target.name, existingAddresses);

		(walletsRes as SuiteRunResult).done((result) => {
			walletsRes = result;
			walletValidationPending = false;
		});
	};

	let walletValidationPending: boolean;
	let walletValidationMessage = ['Checking if addres is available for being a signer...'];

	let thresholdRes = thresholdSuite.get();
	let walletsRes = walletsSuite.get();

	$: allWalletsValid = walletsRes.isValid() || !walletsRes.hasErrors();
	$: thresholdValid = thresholdRes.isValid() || !thresholdRes.hasErrors();
</script>

<div class="main-wrapper">
	<div class="column-1">
		<div class="row-2 align-center">
			<span class="large">Threshold</span>
			<TooltipIcon tooltip={GLOSSARY.threshold} width={0.75} />
		</div>
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
		<div class="row-2 align-center">
			<span class="large">Signers</span>
			<TooltipIcon tooltip={GLOSSARY.signer} width={0.75} />
		</div>
		{#each existingAddresses as multisigAddress, i}
			<SignersListElement
				owner={multisigAddress === owner}
				id={i.toString()}
				{i}
				on:delete={() => onDeleteSigner(existingAddresses.filter(addr => addr !== multisigAddress))}
				bind:address={multisigAddress}
				bind:res={walletsRes}
			/>
		{/each}
		{#each newAddresses as field, i}
			<SignersListElement
				id={field.id}
				i={i + existingAddresses.length}
				on:delete={() => deleteNewAddress(field.id)}
				bind:address={field.address}
				bind:res={walletsRes}
				on:input={(e) => handleWalletsChange(e.detail, field.id)}
				pending={walletValidationPending}
				pendingMessage={walletValidationMessage}
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
