<script lang="ts">
	import { page } from '$app/stores';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface.js';
	import Icon from '@iconify/svelte';
	import { afterUpdate, getContext } from 'svelte';
	import { getProjectSpecificNFTs } from './_functions/getProjectSpecificNFTs.js';
	import NFTsTreasuryLayout from '../_components/NFTsTreasuryLayout.svelte';
	import NFTsTreasuryCollection from './_components/NFTsTreasuryCollection.svelte';

	export let data: DAOProject;

	const daoData: DAOProject = getContext('daoData');

	afterUpdate(() => {
		getProjectSpecificNFTs(
			data.generalInfo.owner,
			data.generalInfo.project_id,
			$page.params.collectionId
		);
	});
</script>

{#await getProjectSpecificNFTs(data.generalInfo.owner, data.generalInfo.project_id, $page.params.collectionId)}
	<NFTsTreasuryLayout {data}>
		<div slot="nftsLength">... NFTs found</div>
		<div class="main-wrapper" slot="main">
			<div class="row-2">
				<Icon icon="svg-spinners:ring-resize" width="1.2rem" />
				<span><i>Loading {$page.params.collectionId} NFTs Treasury...</i></span>
			</div>
		</div>
	</NFTsTreasuryLayout>
{:then projectSpecificNFTTreasury}
	<NFTsTreasuryCollection {daoData} nfts={projectSpecificNFTTreasury} />
{/await}
