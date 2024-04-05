<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { onMount } from 'svelte';
	import { Button } from '@emerald-dao/component-library';
	import MultisigManager from '$lib/features/multisig-manager/components/MultisigManager.svelte';
	import { updateMultisigExecution } from '$flow/actions';
	import * as AdminPage from '../_components/admin-page';

	export let data;

	let activeDao = data.activeDao as DAOProject;

	let allWalletsValid: boolean = false;
	let thresholdValid: boolean = true;

	let existingAddresses: string[];
	let threshold: number;
	let newAddresses: {
		address: string;
		id: string;
	}[] = [];

	const reloadData = () => {
		existingAddresses = activeDao.onChainData.signers;
		threshold = Number(activeDao.onChainData.threshold);
		newAddresses = [];
	};

	onMount(() => {
		reloadData();
	});

	$: activeDao && reloadData();
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
				owner={activeDao.generalInfo.owner}
				projectId={activeDao.generalInfo.project_id}
			/>
			<Button
				state={allWalletsValid &&
				thresholdValid &&
				(Number(activeDao.onChainData.threshold) !== threshold || newAddresses.length > 0)
					? 'active'
					: 'disabled'}
				on:click={() =>
					updateMultisigExecution(
						activeDao.generalInfo.owner,
						activeDao.generalInfo.project_id,
						allAddresses,
						threshold
					)}
			>
				Submit changes
			</Button>
		</AdminPage.Content>
	</AdminPage.Container>
</AdminPage.Root>
