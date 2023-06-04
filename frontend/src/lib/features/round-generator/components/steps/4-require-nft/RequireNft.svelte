<script lang="ts">
	import { getNFTCatalog } from '$flow/actions';
	import { roundGeneratorData } from '$lib/features/round-generator/stores/RoundGeneratorData';
	import Icon from '@iconify/svelte';
</script>

{#await getNFTCatalog()}
	<Icon icon="svg-spinners:ring-resize" />
{:then nfts}
	<div class="column-1">
		<label for="selected-nft">Select NFT required to fund</label>
		<select bind:value={$roundGeneratorData.requiredNft} name="selected-nft">
			<option value={null}> No NFT required </option>
			{#each Object.entries(nfts) as [name, data]}
				<option value={data.identifier}>
					{name}
				</option>
			{/each}
		</select>
	</div>
{:catch}
	<p>Failed to load NFTs. Try again later</p>
{/await}

<style>
	select {
		padding-block: var(--space-1);
		font-size: var(--font-size-1);
		color: var(--clr-text-main);
	}

	option {
		color: var(--clr-text-inverse);
	}
</style>
