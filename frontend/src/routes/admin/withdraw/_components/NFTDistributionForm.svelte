<script type="ts">
	import { fade } from 'svelte/transition';
	import NFTsList from '$lib/features/nft-treasury/components/nfts-list/NFTsList.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import NftAddressInput from './atoms/NftAddressInput.svelte';
	import { getProjectNFTTreasury } from '$flow/actions';
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { withdrawNFTs } from '$lib/features/distribute-tokens/functions/withdrawNFTs';

	export let activeDaoData: DAOProject;

	let address: string;
	let isAddressValid: boolean;
	let selectedCollection: string;
	let selectedNFTIds: string[] = [];

	const resetDistributionForm = () => {
		address = '';
		selectedNFTIds = [];
	};

	const handleCreateWithdrawNftsAction = () => {
		withdrawNFTs(activeDaoData, selectedCollection, selectedNFTIds, address);
		resetDistributionForm();
	};

	let resetAddressValidation: () => void;
</script>

<div in:fade|local={{ duration: 200 }} class="main-wrapper">
	{#await getProjectNFTTreasury(activeDaoData.generalInfo.owner, activeDaoData.generalInfo.project_id) then NFTs}
		{#if Object.values(NFTs).every((array) => array.length === 0)}
			<div class="row-2 align-center">
				<span class="small no-tokens-message"><em>No NFTs available to distribute.</em></span>
			</div>
		{:else}
			<div class="content-wrapper">
				<NftAddressInput
					bind:address
					projectOwner={activeDaoData.generalInfo.owner}
					projectId={activeDaoData.generalInfo.project_id}
					bind:isValid={isAddressValid}
					bind:handleChange={resetAddressValidation}
				/>
				<NFTsList
					bind:selectedNFTIds
					bind:selectedCollection
					{NFTs}
					clickable={true}
					on:collectionChange={resetAddressValidation}
				/>
			</div>
			<Button
				on:click={handleCreateWithdrawNftsAction}
				width="extended"
				state={isAddressValid && selectedNFTIds.length > 0 ? 'active' : 'disabled'}
			>
				{#if selectedNFTIds.length === 1}
					{`Distribute ${selectedNFTIds.length} NFT`}
				{:else if selectedNFTIds.length === 0}
					{`Distribute NFTs`}
				{:else}
					{`Distribute ${selectedNFTIds.length} NFTs`}
				{/if}
				<Icon icon="tabler:arrow-narrow-right" />
			</Button>
		{/if}
	{/await}
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
		}
	}
</style>
