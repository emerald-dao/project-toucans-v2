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
				<span class="strong">
					{`${$paymentData.amount} $${$paymentData.currency}`}
				</span>
				to
				<span class="strong">
					{`${$paymentData.daoName}.`}
				</span>
			{:else if $paymentData.type === 'fund' && $paymentData.amount != undefined}
				{`You funded ${$paymentData.daoName} with`}
				<span class="strong">
					{`${$paymentData.amount} $${$paymentData.currency}`}
				</span>
				and got
				<span class="strong">
					{`${$paymentData.amount * $paymentData.issuanceRate * (1 - $paymentData.reserveRate)} $${
						$paymentData.tokenName
					}.`}
				</span>
			{/if}
		</p>
	</div>
	<div class="column-4">
		<Divider text="Share" />
		<div class="share-buttons-wrapper">
			{#if $paymentData.type === 'donation'}
				<Button
					href={`https://twitter.com/intent/tweet?text=I%20just%20donated%20${$paymentData.daoName}%20DAO%20with%20$${$paymentData.currency}%20${$paymentData.amount}`}
					target="_blank"
					type="ghost"
					color="neutral"
					size="small"><Icon icon="tabler:brand-twitter" />Twitter</Button
				>
			{:else if $paymentData.type === 'fund' && $paymentData.amount != undefined}
				<Button
					href={`https://twitter.com/intent/tweet?text=I%20just%20funded%20${
						$paymentData.daoName
					}%20DAO%20with%20$${$paymentData.currency}%20${$paymentData.amount}%20and%20got%20$${
						$paymentData.tokenName
					}%20${$paymentData.amount * $paymentData.issuanceRate}
				`}
					target="_blank"
					type="ghost"
					color="neutral"
					size="small"><Icon icon="tabler:brand-twitter" />Twitter</Button
				>
			{/if}
			<Button href="https://discord.com/" target="_blank" color="neutral" type="ghost" size="small"
				><Icon icon="tabler:brand-discord" />Discord</Button
			>
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
