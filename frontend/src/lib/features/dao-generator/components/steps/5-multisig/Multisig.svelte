<script lang="ts">
	import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
	import { user } from '$stores/flow/FlowStore';
	import MultisigManager from '$lib/features/multisig-manager/components/MultisigManager.svelte';
	import StepButtons from '../../atoms/StepButtons.svelte';
	import { onMount } from 'svelte';

	let allWalletsValid: boolean = true;
	let thresholdValid: boolean = true;

	onMount(() => {
		$daoGeneratorData.multisig.owner = $user.addr as string;
	});
</script>

<MultisigManager
	bind:allWalletsValid
	bind:thresholdValid
	existingAddresses={[$daoGeneratorData.multisig.owner]}
	bind:newAddresses={$daoGeneratorData.multisig.addresses}
	threshold={$daoGeneratorData.multisig.threshold}
/>
<StepButtons active={allWalletsValid && thresholdValid} />
