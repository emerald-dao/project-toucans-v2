<script lang="ts">
	import NFTCollectionSelectCard from './NFTCollectionSelectCard.svelte';
	import Icon from '@iconify/svelte';
	import type { NftCollection } from '$lib/features/nft-treasury/types/nft-collection.interface.js';
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import type {
		DAOProject,
		DaoDatabaseData
	} from '$lib/types/dao-project/dao-project.interface.js';
	import { removeAllowedNFTCollections } from '../../../../../routes/admin/[projectId]/nft-collections/_actions/removeAllowedNFTCollections';

	export let nftCollection: NftCollection;
	export let selectedCollections: string[];

	const adminData: {
		activeDao: Writable<DAOProject>;
		otherDaos: DaoDatabaseData[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	$: activeDaoData = $activeDaoStore;
</script>

<NFTCollectionSelectCard {nftCollection} bind:selectedCollections isCollectionActive={true}>
	<div
		class="remove-icon header-link"
		data-tooltip="Remove"
		on:click={() =>
			removeAllowedNFTCollections(
				[nftCollection.identifier],
				activeDaoData.generalInfo.owner,
				activeDaoData.generalInfo.project_id
			)}
		on:keydown={() =>
			removeAllowedNFTCollections(
				[nftCollection.identifier],
				activeDaoData.generalInfo.owner,
				activeDaoData.generalInfo.project_id
			)}
	>
		<Icon icon="tabler:x" width="20" height="20" />
	</div>
</NFTCollectionSelectCard>

<style lang="scss">
	.remove-icon {
		position: absolute;
		top: 8px;
		right: 8px;
	}
</style>
