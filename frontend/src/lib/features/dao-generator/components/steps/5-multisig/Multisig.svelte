<script lang="ts">
	import { user } from '$lib/stores/flow/FlowStore';
	import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
	import MultisigInput from './atoms/MultisigInput.svelte';
	import StepButtons from '../../atoms/StepButtons.svelte';
	import Icon from '@iconify/svelte';

	$daoGeneratorData.multisig.addresses[0] = $user.addr as string;

	let walletsValidations: boolean[] = [true];

	const addMultisig = () => {
		$daoGeneratorData.multisig.addresses = [...$daoGeneratorData.multisig.addresses, ''];
		walletsValidations = [...walletsValidations, false];
	};

	const deleteMultisig = (i: number) => {
		$daoGeneratorData.multisig.addresses = $daoGeneratorData.multisig.addresses.filter(
			(_, index) => index !== i
		);
		walletsValidations = walletsValidations.filter((_, index) => index !== i);
	};

	$: allWalletsValid = walletsValidations.every((walletValid) => walletValid);
</script>

<div class="main-wrapper">
	{#each $daoGeneratorData.multisig.addresses as multisigAdress, index}
		<MultisigInput
			{index}
			on:delete={() => deleteMultisig(index)}
			bind:address={multisigAdress}
			bind:walletValid={walletsValidations[index]}
		/>
	{/each}
	<div class="add-wallet-wrapper">
		<div class="row-2 align-center add-wallet-icon-wrapper" on:click={addMultisig} on:keydown>
			<span class="small">Add wallet</span>
			<Icon icon="tabler:square-rounded-plus" />
		</div>
	</div>
</div>
<StepButtons active={allWalletsValid} />

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;

		.add-wallet-wrapper {
			display: flex;
			justify-content: center;
			padding-block: var(--space-2);

			.add-wallet-icon-wrapper {
				cursor: pointer;
			}
		}
	}
</style>
