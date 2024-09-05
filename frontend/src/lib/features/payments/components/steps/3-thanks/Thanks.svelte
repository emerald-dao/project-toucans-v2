<script type="ts">
	import StepTitle from './../../atoms/StepTitle.svelte';
	import Icon from '@iconify/svelte';
	import { Button, Currency, Divider } from '@emerald-dao/component-library';
	import { fade } from 'svelte/transition';
	import { paymentData } from '$lib/features/payments/stores/PaymentData';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;
</script>

<div in:fade={{ duration: 200 }} class="main-wrapper">
	<div class="column align-center">
		<StepTitle {daoData} title="Thanks!" />
		<p>
			{#if $paymentData.type === 'donation'}
				{`You donated`}
				{#if $paymentData.currency === 'NFTs' && $paymentData.NFTs && $paymentData.NFTCollection}
					<span class="strong">
						{`${$paymentData.NFTs.length} NFTs from the ${$paymentData.NFTCollection} collection`}
					</span>
				{:else}
					<span class="strong">
						{`${$paymentData.amount} $${$paymentData.currency}`}
					</span>
				{/if}
				to
				<span class="strong">
					{`${$paymentData.daoName}.`}
				</span>
			{:else if $paymentData.type === 'fund'}
				{`You funded ${$paymentData.daoName} with`}
				<span class="strong">
					{`${$paymentData.amount} $${$paymentData.currency}`}
				</span>
				and got
				<span class="strong">
					{`${
						$paymentData.amount * 0.98 * $paymentData.issuanceRate * (1 - $paymentData.reserveRate)
					} $${$paymentData.tokenName}.`}
				</span>
			{/if}
		</p>
	</div>
	<div class="column-4">
		<Divider text="Share" />
		<div class="share-buttons-wrapper">
			{#if $paymentData.type === 'donation'}
				{#if $paymentData.currency === 'NFTs' && $paymentData.NFTs && $paymentData.NFTCollection}
					<Button
						href={`https://twitter.com/intent/tweet?text=I%20just%20donated%20${
							$paymentData.NFTs.length
						}%20${$paymentData.NFTs.length == 1 ? 'NFT' : 'NFTs'}%20from%20the%20${
							$paymentData.NFTCollection
						}%20collection%20to%20${
							daoData.generalInfo.twitter ? `@${daoData.generalInfo.twitter}` : $paymentData.daoName
						}%20on%20Toucans!%0D%0A%0D%0Ahttps://toucans.ecdao.org/p/${
							daoData.generalInfo.project_id
						}`}
						target="_blank"
						type="ghost"
						color="neutral"
						size="small"><Icon icon="tabler:brand-twitter" />Twitter</Button
					>
				{:else}
					<Button
						href={`https://twitter.com/intent/tweet?text=I%20just%20donated%20${
							$paymentData.amount
						}%20$${$paymentData.currency}%20to%20${
							daoData.generalInfo.twitter ? `@${daoData.generalInfo.twitter}` : $paymentData.daoName
						}%20on%20Toucans!%0D%0A%0D%0Ahttps://toucans.ecdao.org/p/${
							daoData.generalInfo.project_id
						}`}
						target="_blank"
						type="ghost"
						color="neutral"
						size="small"><Icon icon="tabler:brand-twitter" />Twitter</Button
					>
				{/if}
			{:else if $paymentData.type === 'fund'}
				<Button
					href={`https://twitter.com/intent/tweet?text=I%20just%20funded%20${
						daoData.generalInfo.twitter ? `@${daoData.generalInfo.twitter}` : $paymentData.daoName
					}%20with%20${$paymentData.amount}%20$${
						$paymentData.currency
					}%20on%20Toucans%20and%20got%20${
						$paymentData.amount * 0.98 * $paymentData.issuanceRate * (1 - $paymentData.reserveRate)
					}%20$${$paymentData.tokenName}.%0D%0A%0D%0Ahttps://toucans.ecdao.org/p/${
						daoData.generalInfo.project_id
					}`}
					target="_blank"
					type="ghost"
					color="neutral"
					size="small"><Icon icon="tabler:brand-twitter" />Twitter</Button
				>
			{/if}
			{#if daoData.generalInfo.discord}
				<Button
					href="https://discord.com/{daoData.generalInfo.discord}"
					target="_blank"
					color="neutral"
					type="ghost"
					size="small"><Icon icon="tabler:brand-discord" />Discord</Button
				>
			{/if}
		</div>
	</div>
</div>

<style type="scss">
	.main-wrapper {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.share-buttons-wrapper {
			display: flex;
			justify-content: center;
			gap: var(--space-4);
		}

		p {
			text-align: center;
			max-width: 30ch;
			font-size: var(--fs-300);
			margin-block: var(--space-5);

			span.strong {
				color: var(--clr-heading-main);
			}
		}
	}
</style>
