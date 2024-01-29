<script type="ts">
	import { fade } from 'svelte/transition';
	import NFTsList from '$lib/features/nft-treasury/components/nfts-list/NFTsList.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import NftAddressInput from './atoms/NftAddressInput.svelte';
	import { Button } from '@emerald-dao/component-library';
	import { canReceiveNFTCollection } from '$flow/actions';
	import Icon from '@iconify/svelte';
	import { withdrawNFTs } from '$lib/features/distribute-tokens/functions/withdrawNFTs';
	import type { Nft } from '$lib/features/nft-treasury/types/nft.interface';
	import SpecialMessage from '$lib/features/payments/components/atoms/SpecialMessage.svelte';

	export let activeDaoData: DAOProject;
	export let NFTs: {
		[collectionIdentifier: string]: Nft[];
	};

	let address: string;
	let isAddressValid: boolean;
	let selectedCollection: string;
	let reasonMessage: string = '';
	let selectedNFTIds: string[] = [];

	const resetDistributionForm = () => {
		address = '';
		selectedNFTIds = [];
	};

	const handleCreateWithdrawNftsAction = async () => {
		const canReceiveNFT = await canReceiveNFTCollection(address, selectedCollection);

		if (!canReceiveNFT) {
			alert(
				"The user cannot receive this type of NFT because they don't have a collection set up."
			);
		}

		withdrawNFTs(activeDaoData, selectedCollection, selectedNFTIds, address, reasonMessage);
		resetDistributionForm();
	};

	let resetAddressValidation: () => void;
</script>

<div in:fade|local={{ duration: 200 }} class="main-wrapper">
	<div class="content-wrapper">
		<NftAddressInput
			bind:address
			bind:isValid={isAddressValid}
			bind:handleChange={resetAddressValidation}
			collectionId={selectedCollection}
		/>
		<NFTsList
			bind:selectedNFTIds
			bind:selectedCollection
			{NFTs}
			clickable={true}
			on:collectionChange={resetAddressValidation}
		/>
		<div class="special-message">
			<SpecialMessage bind:message={reasonMessage} messageText="Add a reason for withdrawl" />
		</div>
	</div>
	<Button
		on:click={handleCreateWithdrawNftsAction}
		width="extended"
		state={isAddressValid && selectedNFTIds.length > 0 ? 'active' : 'disabled'}
	>
		{#if selectedNFTIds.length === 1}
			{`Distribute 1 NFT`}
		{:else if selectedNFTIds.length === 0}
			{`Distribute NFTs`}
		{:else}
			{`Distribute ${selectedNFTIds.length} NFTs`}
		{/if}
		<Icon icon="tabler:arrow-narrow-right" />
	</Button>
</div>

<style lang="scss">
	.main-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
		align-items: end;
		width: 100%;
		justify-content: space-between;

		.content-wrapper {
			width: 100%;

			.special-message {
				margin-top: var(--space-3);
			}
		}
	}
</style>
