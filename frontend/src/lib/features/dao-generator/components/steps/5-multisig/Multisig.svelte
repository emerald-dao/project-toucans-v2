<script lang="ts">
	import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
	import { user } from '$stores/flow/FlowStore';
	import MultisigManager from '$lib/features/add-signature/components/MultisigManager.svelte';
	import StepButtons from '../../atoms/StepButtons.svelte';
	import { onMount } from 'svelte';

	let allWalletsValid: boolean = true;
	let thresholdValid: boolean = true;

	onMount(() => {
		$daoGeneratorData.multisig.addresses = [$user.addr as string];
	});
</script>

<MultisigManager
	bind:allWalletsValid
	bind:thresholdValid
	bind:addresses={$daoGeneratorData.multisig.addresses}
	threshold={$daoGeneratorData.multisig.threshold}
/>
<StepButtons active={allWalletsValid && thresholdValid} />
