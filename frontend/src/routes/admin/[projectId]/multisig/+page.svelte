<script type="ts">
	import { onMount } from 'svelte';
	import { Button } from '@emerald-dao/component-library';
	import MultisigManager from '$lib/features/multisig-manager/components/MultisigManager.svelte';
	import { updateMultisigExecution } from '$flow/actions';
	import * as AdminPage from '../_components/admin-page';

	export let data;

	let allWalletsValid: boolean = false;
	let thresholdValid: boolean = true;

	let existingAddresses: string[];
	let threshold: number;
	let newAddresses: {
		address: string;
		id: string;
	}[] = [];

	const reloadData = () => {
		existingAddresses = data.activeDao.onChainData.signers;
		threshold = Number(data.activeDao.onChainData.threshold);
		newAddresses = [];
	};

	onMount(() => {
		reloadData();
	});

	$: data.activeDao && reloadData();
	$: allAddresses = existingAddresses.concat(newAddresses.map((address) => address.address));
</script>

<AdminPage.Root>
	<AdminPage.Header>
		<AdminPage.Title>Multisig</AdminPage.Title>
		<AdminPage.Description>Manage the signers of your DAO.</AdminPage.Description>
	</AdminPage.Header>
	<AdminPage.Container grid={false}>
		<AdminPage.Content>
			<MultisigManager
				bind:existingAddresses
				bind:newAddresses
				bind:allWalletsValid
				bind:thresholdValid
				bind:threshold
				owner={data.activeDao.generalInfo.owner}
				projectId={data.activeDao.generalInfo.project_id}
			/>
			<Button
				state={allWalletsValid &&
				thresholdValid &&
				(Number(data.activeDao.onChainData.threshold) !== threshold || newAddresses.length > 0)
					? 'active'
					: 'disabled'}
				on:click={() =>
					updateMultisigExecution(
						data.activeDao.generalInfo.owner,
						data.activeDao.generalInfo.project_id,
						allAddresses,
						threshold
					)}
			>
				Submit changes
			</Button>
		</AdminPage.Content>
	</AdminPage.Container>
</AdminPage.Root>
