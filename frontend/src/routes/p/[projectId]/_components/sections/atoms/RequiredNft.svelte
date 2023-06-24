<script lang="ts">
	import type { RequiredNft } from '$lib/types/dao-project/dao-project.interface';
	import { Label, TooltipIcon } from '@emerald-dao/component-library';

	export let nft: RequiredNft;
</script>

<div class="column">
	<div class="row-1 align-center">
		<span> Required NFT </span>
		<TooltipIcon
			width={0.5}
			tooltip={`You must hold a ${nft.name} NFT to fund this round`}
			backgroundColor="var(--clr-neutral-badge)"
			borderColor="var(--clr-neutral-badge)"
		/>
	</div>
	<Label size="xx-small" color="neutral" hasBorder={false}>
		<img src={nft.image} alt="NFT required to fund" />
		{nft.name}
	</Label>
</div>

<style lang="scss">
	img {
		width: 1.8rem;
		height: 1.8rem;
		margin-right: 0.5rem;
	}

	span {
		font-size: 0.65rem;
	}
</style>
