<script lang="ts">
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import type { createSteps } from '$stores/custom/steps/Steps';
	import type { createActiveStep } from '$stores/custom/steps/ActiveStep';
	import type { daoGeneratorData as TdaoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
	import type { daoAndTokenGeneratorData } from '$lib/features/dao-generator/stores/DaoAndTokenGeneratorData';
	import { fly } from 'svelte/transition';
	import StepButtons from '../../atoms/StepButtons.svelte';

	const daoGeneratorData: typeof TdaoGeneratorData | typeof daoAndTokenGeneratorData =
		getContext('daoGeneratorData');
	const generatorActiveStep: ReturnType<typeof createActiveStep> =
		getContext('daoGeneratorActiveStep');
	const daoGeneratorSteps: ReturnType<typeof createSteps> = getContext('daoGeneratorSteps');

	const projectNFTs: {
		[collectionIdentifier: string]: {
			identifier: string;
			name: string;
			image: string;
		};
	} = getContext('projectNFTCatalog');

	let nftsArray = Object.values(projectNFTs);

	export let pageSize = 3;
	let currentPage = 1;
	const nextPage = () => {
		currentPage += 1;
	};
	const prevPage = () => {
		currentPage -= 1;
	};
	$: pageStart = (currentPage - 1) * pageSize;
	$: pageEnd = pageStart + pageSize;

	$: currentPageNFTs = nftsArray.slice(pageStart, pageEnd);

	let selectedNFTs: string[] = [];

	$: $daoGeneratorData.daoDetails.allowedNFTCollections = selectedNFTs;

	function handleNFTClick(index: string) {
		if (selectedNFTs.includes(index)) {
			selectedNFTs = selectedNFTs.filter((item) => item !== index);
		} else {
			selectedNFTs = [...selectedNFTs, index];
		}
	}
</script>

<form
	id={$daoGeneratorSteps[$generatorActiveStep].slug}
	on:submit|preventDefault={generatorActiveStep.increment}
	autocomplete="off"
	in:fly={{ y: 30, duration: 400 }}
>
	<div class="introduction">
		<h5>NFT Treasury</h5>
		<p class="small">{`Please select the collections from which you would like to receive NFTs`}</p>
	</div>
	<div class="nfts-wrapper">
		{#each currentPageNFTs as NFT, i}
			<div
				class="card-wrapper"
				class:selected={selectedNFTs.includes(NFT.identifier)}
				on:click={() => handleNFTClick(NFT.identifier)}
			>
				<img src={NFT.image} alt="NFT" />
				<p class="heading">{NFT.identifier}</p>
				<span class="small">{NFT.name}</span>
			</div>
		{/each}
	</div>
	<div class="pagination row-space-between">
		<div class="row-4">
			<Button
				on:click={prevPage}
				state={currentPage === 1 ? 'disabled' : 'active'}
				type="transparent"
				color="neutral"
			>
				<Icon icon="tabler:arrow-left" />
			</Button>
			<Button
				on:click={nextPage}
				state={pageEnd >= nftsArray.length ? 'disabled' : 'active'}
				type="transparent"
				color="neutral"
			>
				<Icon icon="tabler:arrow-right" />
			</Button>
		</div>
	</div>
	<StepButtons />
</form>

<style lang="scss">
	.introduction {
		margin-bottom: var(--space-10);
		h5 {
			margin-bottom: var(--space-2);
			margin-top: 0;
		}
	}
	.nfts-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-4) var(--space-8);

		.card-wrapper {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			border: 1px solid var(--clr-border-primary);
			border-radius: var(--radius-4);
			padding: var(--space-4) 0;
			gap: var(--space-2);
			text-align: center;
			cursor: pointer;
			position: relative;

			img {
				border-radius: 50%;
				width: 100px;
				height: 100px;
			}

			&.selected {
				background-color: var(--clr-primary-600);
			}
		}
	}
	.pagination {
		margin-top: var(--space-10);
	}
</style>
