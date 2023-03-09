<script type="ts">
	import { fly } from 'svelte/transition';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { Button } from '@emerald-dao/component-library';
	import MultisigManager from '$lib/features/add-signature/components/MultisigManager.svelte';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: DAOProject[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;

	$: activeDaoData = adminData.userDaos[$activeDaoStore];

	let allWalletsValid: boolean = false;
	let thresholdValid: boolean = false;

	let addresses: string[] = [''];
	let threshold: number;

	onMount(() => {
		addresses = activeDaoData.onChainData.signers;
		threshold = Number(activeDaoData.onChainData.threshold);
	});
</script>

<div in:fly={{ x: 10, duration: 400 }} class="main-wrapper">
	<div>
		<h5>Multisig</h5>
		<p class="small">Manage the signers of your DAO.</p>
	</div>
	<MultisigManager bind:addresses bind:allWalletsValid bind:thresholdValid bind:threshold />

	<Button
		state={allWalletsValid &&
		thresholdValid &&
		Number(activeDaoData.onChainData.threshold) !== threshold &&
		activeDaoData.onChainData.signers.length !== addresses.length
			? 'active'
			: 'disabled'}
	>
		Submit changes
	</Button>
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: var(--space-10);

		h5 {
			margin-bottom: var(--space-2);
			margin-top: 0;
		}
	}
</style>
