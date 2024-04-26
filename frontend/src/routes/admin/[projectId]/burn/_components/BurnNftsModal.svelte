<script lang="ts">
	import { Button, Modal, getModal } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let selectedNFTIds: string[] = [];
	export let selectedCollectionId: string;
	export let activeDaoId: string;

	const handleOpenModal = () => {
		const modal = getModal('burn-nfts-modal');
		modal.open();
	};

	const handlBurnNfts = () => {
		// const actionResult = await burnNfts(activeDaoId, selectedNFTIds, selectedCollectionId);
		// if (actionResult.state === 'success') {
		// 	selectedNFTIds = [];
		// 	const modal = getModal('burn-nfts-modal');
		// 	modal.close();
		// }
	};
</script>

<Button
	on:click={handleOpenModal}
	width="extended"
	state={selectedNFTIds.length > 0 ? 'active' : 'disabled'}
>
	<Icon icon="tabler:campfire" />
	{#if selectedNFTIds.length === 1}
		{`Burn 1 NFT`}
	{:else if selectedNFTIds.length === 0}
		{`Burn NFTs`}
	{:else}
		{`Burn ${selectedNFTIds.length} NFTs`}
	{/if}
</Button>
<Modal id="burn-nfts-modal">
	<div class="column-4">
		<p>
			{`Are you sure you want to burn ${selectedNFTIds.length} ${
				selectedNFTIds.length > 1 ? 'NFTs' : 'NFT'
			}`}?
		</p>
		<Button on:click={handlBurnNfts} width="extended" state="active">
			<Icon icon="tabler:campfire" />
			{#if selectedNFTIds.length === 1}
				{`Burn 1 NFT`}
			{:else}
				{`Burn ${selectedNFTIds.length} NFTs`}
			{/if}
		</Button>
	</div>
</Modal>
