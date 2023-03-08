<script type="ts">
	import SignatureElement from './_components/SignatureElement.svelte';
	import { fly } from 'svelte/transition';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: DAOProject[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;

	$: activeDaoData = adminData.userDaos[$activeDaoStore];

	console.log(adminData.userDaos[$activeDaoStore]);
</script>

<div in:fly={{ x: 10, duration: 400 }} class="main-wrapper">
	<div>
		<h5>Multisig</h5>
		<p class="small">Manage the signers of your DAO.</p>
	</div>
	<div>
		{#each activeDaoData.onChainData.signers as signer, i}
			<SignatureElement address={signer} {i} />
		{/each}
	</div>
	<div class="column align-end">
		<Button>
			<Icon icon="tabler:plus" />
			Add Signer
		</Button>
	</div>
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
